import type { APIRoute } from 'astro';
import {
  NotConfiguredError,
  createRateLimiter,
  createSubmissionLedger,
  handleQuote,
  resendSender,
  type OutgoingEmail,
} from '../../lib/quote';

export const prerender = false;

const MAX_BODY_BYTES = 16 * 1024;
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const ledger = createSubmissionLedger(60 * 60 * 1000);

function env(key: string): string | undefined {
  return process.env[key] || (import.meta.env[key] as string | undefined) || undefined;
}

function sender(): (mail: OutgoingEmail) => Promise<void> {
  const apiKey = env('RESEND_API_KEY');
  const to = env('QUOTE_TO_EMAIL');
  const from = env('QUOTE_FROM_EMAIL');
  if (apiKey && to && from) return resendSender({ apiKey, to, from });
  if (import.meta.env.DEV) {
    return async (mail) => console.info('[quote] email not configured, logging instead:\n', mail.subject, '\n', mail.text);
  }
  return async () => {
    throw new NotConfiguredError('RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL must be set');
  };
}

// Compares the browser's Origin with the host it actually requested. `request.url` can't be used:
// behind a proxy (or in `astro preview`) it carries the server's internal host, not the public one.
function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() || request.headers.get('host');
  try {
    return Boolean(host) && new URL(origin).host === host;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (status: number, body: Record<string, unknown>) => {
    if (wantsJson) return Response.json(body, { status });
    // No-JS fallback: plain form posts land on a page instead of raw JSON.
    return redirect(body.ok ? '/contact/thanks' : `/contact?error=${String(body.code ?? 'invalid')}#quote`, 303);
  };

  if (!sameOrigin(request)) return reply(403, { ok: false, code: 'forbidden' });
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return reply(413, { ok: false, code: 'too_large' });

  let raw: Record<string, unknown>;
  try {
    const type = request.headers.get('content-type') ?? '';
    if (type.includes('application/json')) {
      const json: unknown = await request.json();
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('Expected an object');
      raw = json as Record<string, unknown>;
    } else {
      raw = Object.fromEntries((await request.formData()).entries());
    }
  } catch {
    return reply(400, { ok: false, code: 'invalid', errors: { form: 'We could not read your request. Please try again.' } });
  }

  const outcome = await handleQuote(raw, clientAddress || 'unknown', {
    send: sender(),
    now: Date.now,
    newId: () => crypto.randomUUID(),
    limiter,
    ledger,
  });
  return reply(outcome.status, outcome.body);
};
