import { describe, expect, it, vi } from 'vitest';
import {
  MIN_FILL_MS,
  NotConfiguredError,
  createRateLimiter,
  createSubmissionLedger,
  escapeHtml,
  formatEmail,
  handleQuote,
  pickFields,
  resendSender,
  type OutgoingEmail,
  type QuoteDeps,
} from '../src/lib/quote';
import { legacyRedirects, services } from '../src/data/services';

const NOW = 1_800_000_000_000;

function valid(overrides: Record<string, unknown> = {}) {
  return {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+44 7700 900123',
    service: 'kitchen-renovation',
    message: 'We would like a quote for a new kitchen.',
    consent: 'yes',
    submissionId: 'abc12345-def6',
    startedAt: String(NOW - 60_000),
    website: '',
    ...overrides,
  };
}

function deps(overrides: Partial<QuoteDeps> = {}) {
  const sent: OutgoingEmail[] = [];
  const d: QuoteDeps = {
    send: vi.fn(async (mail: OutgoingEmail) => { sent.push(mail); }),
    now: () => NOW,
    newId: (() => { let n = 0; return () => `generated-${++n}`; })(),
    limiter: createRateLimiter({ limit: 5, windowMs: 600_000 }),
    ledger: createSubmissionLedger(3_600_000),
    ...overrides,
  };
  return { d, sent };
}

describe('handleQuote', () => {
  it('accepts a valid request and sends one email', async () => {
    const { d, sent } = deps();
    const out = await handleQuote(valid(), '1.1.1.1', d);
    expect(out).toEqual({ status: 200, body: { ok: true } });
    expect(sent).toHaveLength(1);
    expect(sent[0].subject).toBe('Quote request: Kitchen renovation from Jane Smith');
    expect(sent[0].replyTo).toBe('jane@example.com');
  });

  it('returns field errors for missing and malformed fields', async () => {
    const { d, sent } = deps();
    const out = await handleQuote(valid({ name: '', email: 'nope', phone: 'abc', message: 'short', consent: undefined }), 'ip', d);
    expect(out.status).toBe(400);
    if (out.body.ok || out.body.code !== 'invalid') throw new Error('expected invalid');
    expect(Object.keys(out.body.errors).sort()).toEqual(['consent', 'email', 'message', 'name', 'phone']);
    expect(sent).toHaveLength(0);
  });

  it('gives readable messages when fields are missing entirely', async () => {
    const { d } = deps();
    const out = await handleQuote({}, 'ip', d);
    if (out.body.ok || out.body.code !== 'invalid') throw new Error('expected invalid');
    expect(Object.values(out.body.errors).join(' ')).not.toMatch(/Invalid input/);
    expect(out.body.errors.email).toBe('Please enter your email address.');
  });

  it('rejects services outside the allow-list', async () => {
    const { d } = deps();
    const out = await handleQuote(valid({ service: 'nuclear-reactor' }), 'ip', d);
    expect(out.status).toBe(400);
  });

  it('ignores unknown fields entirely', async () => {
    const { d, sent } = deps();
    await handleQuote(valid({ isAdmin: 'true', price: '0' }), 'ip', d);
    expect(sent[0].text).not.toContain('isAdmin');
    expect(pickFields({ ...valid(), isAdmin: true })).not.toHaveProperty('isAdmin');
  });

  it('silently drops honeypot submissions', async () => {
    const { d, sent } = deps();
    const out = await handleQuote(valid({ website: 'http://spam.example' }), 'ip', d);
    expect(out.status).toBe(200);
    expect(sent).toHaveLength(0);
  });

  it('rejects forms submitted faster than a human could fill them', async () => {
    const { d, sent } = deps();
    const out = await handleQuote(valid({ startedAt: String(NOW - MIN_FILL_MS + 500) }), 'ip', d);
    expect(out.status).toBe(400);
    expect(out.body).toMatchObject({ code: 'too_fast' });
    expect(sent).toHaveLength(0);
  });

  it('rate limits repeated requests from one client', async () => {
    const { d } = deps();
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleQuote(valid({ submissionId: `submission-${i}` }), 'same-ip', d)).status);
    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect((await handleQuote(valid({ submissionId: 'other-ip-1' }), 'other-ip', d)).status).toBe(200);
  });

  it('sends a duplicated submission only once', async () => {
    const { d, sent } = deps();
    const [a, b] = await Promise.all([handleQuote(valid(), 'ip', d), handleQuote(valid(), 'ip', d)]);
    expect([a.status, b.status]).toEqual([200, 200]);
    expect(sent).toHaveLength(1);
  });

  it('lets the user retry after a failed send', async () => {
    let fail = true;
    const { d } = deps({ send: vi.fn(async () => { if (fail) throw new Error('down'); }) });
    expect((await handleQuote(valid(), 'ip', d)).status).toBe(502);
    fail = false;
    expect((await handleQuote(valid(), 'ip', d)).status).toBe(200);
    expect(d.send).toHaveBeenCalledTimes(2);
  });

  it('accepts plain no-JS posts without id or timestamp, and keeps different people apart', async () => {
    const { d, sent } = deps();
    const noJs = { submissionId: '', startedAt: '' };
    expect((await handleQuote(valid({ ...noJs, name: 'First Person' }), 'ip-a', d)).status).toBe(200);
    expect((await handleQuote(valid({ ...noJs, name: 'Second Person' }), 'ip-b', d)).status).toBe(200);
    expect(sent.map((m) => m.subject)).toEqual([
      'Quote request: Kitchen renovation from First Person',
      'Quote request: Kitchen renovation from Second Person',
    ]);
  });

  it('reports a missing email configuration as 503', async () => {
    const { d } = deps({ send: async () => { throw new NotConfiguredError('missing'); } });
    const out = await handleQuote(valid(), 'ip', d);
    expect(out.status).toBe(503);
    expect(out.body).toMatchObject({ code: 'not_configured' });
  });
});

describe('formatEmail', () => {
  it('escapes HTML from user input', () => {
    const mail = formatEmail({
      name: '<script>alert(1)</script>',
      email: 'a@b.co',
      phone: '07700900123',
      service: 'other',
      message: 'Hi <b>there</b> & "you"',
      consent: 'yes',
      submissionId: 'abcdefgh',
      startedAt: 1,
    });
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
    expect(mail.html).toContain('Hi &lt;b&gt;there&lt;/b&gt; &amp; &quot;you&quot;');
    expect(mail.subject).toContain('Something else');
  });

  it('escapeHtml covers all special characters', () => {
    expect(escapeHtml(`<>&"'`)).toBe('&lt;&gt;&amp;&quot;&#39;');
  });
});

describe('resendSender', () => {
  it('posts to Resend and throws on a non-2xx response', async () => {
    const fetchImpl = vi.fn(async () => new Response('{}', { status: 500 }));
    const send = resendSender({ apiKey: 'k', to: 'to@x.co', from: 'from@x.co' }, fetchImpl as unknown as typeof fetch);
    await expect(send({ subject: 's', text: 't', html: 'h', replyTo: 'r@x.co' })).rejects.toThrow('500');
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(JSON.parse(String(init.body))).toMatchObject({ to: ['to@x.co'], reply_to: 'r@x.co' });
  });
});

describe('service catalogue', () => {
  it('has unique slugs', () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('redirects every one of the 22 old service pages', () => {
    const redirects = legacyRedirects();
    expect(Object.keys(redirects)).toHaveLength(22);
    for (const target of Object.values(redirects)) {
      expect(services.some((s) => `/services/${s.slug}` === target)).toBe(true);
    }
  });
});
