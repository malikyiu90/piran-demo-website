// Quote request handling: validation, abuse protection, idempotency and email formatting.
// Pure and dependency-injected so it can be unit tested without a server or network.
import { z } from 'astro/zod';
import { services, serviceSlugs } from '../data/services';

export const SERVICE_OPTIONS = [...serviceSlugs, 'other'] as const;
const FIELDS = ['name', 'email', 'phone', 'service', 'message', 'consent', 'submissionId', 'startedAt', 'website'] as const;

/** Minimum time between rendering the form and submitting it; faster than this is almost certainly a bot. */
export const MIN_FILL_MS = 3000;

export const quoteSchema = z.object({
  name: z.string({ error: 'Please enter your name.' }).trim().min(2, { error: 'Please enter your name.' }).max(80, { error: 'Please keep your name under 80 characters.' }),
  email: z.string({ error: 'Please enter your email address.' }).trim().max(254, { error: 'That email address is too long.' }).pipe(z.email({ error: 'Please enter a valid email address.' })),
  phone: z.string({ error: 'Please enter your phone number.' }).trim().regex(/^\+?[0-9][0-9 ()-]{6,19}$/, { error: 'Please enter a valid phone number.' }),
  service: z.enum(SERVICE_OPTIONS, { error: 'Please choose a service.' }),
  message: z.string({ error: 'Please tell us about your project.' }).trim().min(10, { error: 'Please tell us a little more (at least 10 characters).' }).max(2000, { error: 'Please keep your message under 2000 characters.' }),
  consent: z.literal('yes', { error: 'Please confirm we can contact you about your enquiry.' }),
  // Both are set by the form script. Plain (no-JS) posts omit them: the server then assigns an id and skips the timing check.
  submissionId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/, { error: 'Invalid submission. Please reload the page and try again.' }).optional(),
  startedAt: z.coerce.number().int().positive({ error: 'Invalid submission. Please reload the page and try again.' }).optional(),
});

export type QuoteRequest = z.infer<typeof quoteSchema>;

export interface OutgoingEmail {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
}

export class NotConfiguredError extends Error {}

export interface RateLimiter {
  /** Records an attempt for `key`; returns false when the key is over its limit. */
  hit(key: string, now: number): boolean;
}

export interface SubmissionLedger {
  /** Claims an id; returns false if it was already claimed and has not expired. */
  claim(id: string, now: number): boolean;
  release(id: string): void;
}

export interface QuoteDeps {
  send(email: OutgoingEmail): Promise<void>;
  now(): number;
  newId(): string;
  limiter: RateLimiter;
  ledger: SubmissionLedger;
}

export type QuoteOutcome =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { ok: false; code: 'invalid'; errors: Record<string, string> } }
  | { status: 400; body: { ok: false; code: 'too_fast'; message: string } }
  | { status: 429; body: { ok: false; code: 'rate_limited'; message: string } }
  | { status: 502 | 503; body: { ok: false; code: 'send_failed' | 'not_configured'; message: string } };

const FALLBACK = 'Please call or WhatsApp us on +44 7405 308436 instead.';

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    hit(key, now) {
      if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      entry.count += 1;
      return entry.count <= limit;
    },
  };
}

export function createSubmissionLedger(ttlMs: number): SubmissionLedger {
  const claimed = new Map<string, number>();
  return {
    claim(id, now) {
      if (claimed.size > 5000) for (const [k, exp] of claimed) if (exp <= now) claimed.delete(k);
      const expiry = claimed.get(id);
      if (expiry && expiry > now) return false;
      claimed.set(id, now + ttlMs);
      return true;
    },
    release(id) {
      claimed.delete(id);
    },
  };
}

/** Copies only the known form fields, as trimmed strings, so nothing else reaches validation or email. */
export function pickFields(raw: Record<string, unknown>): Record<string, string> {
  const picked: Record<string, string> = {};
  for (const key of FIELDS) {
    const value = raw[key];
    if (typeof value === 'string') picked[key] = value;
    else if (typeof value === 'number' || typeof value === 'boolean') picked[key] = String(value);
  }
  return picked;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export function serviceLabel(slug: string): string {
  return services.find((s) => s.slug === slug)?.name ?? 'Something else';
}

export function formatEmail(q: QuoteRequest): OutgoingEmail {
  const service = serviceLabel(q.service);
  const rows: [string, string][] = [
    ['Name', q.name],
    ['Email', q.email],
    ['Phone', q.phone],
    ['Service', service],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${q.message}\n`;
  const html = `<h2 style="font-family:Georgia,serif;font-weight:400">New quote request</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
${rows.map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`).join('\n')}
</table>
<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(q.message)}</p>`;
  return { subject: `Quote request: ${service} from ${q.name}`, text, html, replyTo: q.email };
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    errors[key] ??= issue.message;
  }
  return errors;
}

export async function handleQuote(raw: Record<string, unknown>, clientKey: string, deps: QuoteDeps): Promise<QuoteOutcome> {
  const now = deps.now();

  if (!deps.limiter.hit(clientKey, now)) {
    return { status: 429, body: { ok: false, code: 'rate_limited', message: `Too many requests. Please wait a few minutes. ${FALLBACK}` } };
  }

  const fields = pickFields(raw);
  // Empty strings from blank hidden inputs mean "not provided".
  if (!fields.submissionId) delete fields.submissionId;
  if (!fields.startedAt) delete fields.startedAt;

  // Honeypot filled in: pretend success so bots learn nothing, and send nothing.
  if (fields.website) return { status: 200, body: { ok: true } };

  const parsed = quoteSchema.safeParse(fields);
  if (!parsed.success) return { status: 400, body: { ok: false, code: 'invalid', errors: fieldErrors(parsed.error) } };

  const quote = parsed.data;
  if (quote.startedAt !== undefined && now - quote.startedAt < MIN_FILL_MS) {
    return { status: 400, body: { ok: false, code: 'too_fast', message: 'That was quick! Please check your details and send again.' } };
  }

  // Same submission sent twice (double click, retry after a slow response): acknowledge, don't resend.
  const submissionId = quote.submissionId ?? deps.newId();
  if (!deps.ledger.claim(submissionId, now)) return { status: 200, body: { ok: true } };

  try {
    await deps.send(formatEmail(quote));
  } catch (error) {
    deps.ledger.release(submissionId);
    if (error instanceof NotConfiguredError) {
      return { status: 503, body: { ok: false, code: 'not_configured', message: `Online quotes are temporarily unavailable. ${FALLBACK}` } };
    }
    return { status: 502, body: { ok: false, code: 'send_failed', message: `We couldn't send your request just now. ${FALLBACK}` } };
  }

  return { status: 200, body: { ok: true } };
}

export interface ResendConfig {
  apiKey: string;
  to: string;
  from: string;
}

export function resendSender(config: ResendConfig, fetchImpl: typeof fetch = fetch) {
  return async (mail: OutgoingEmail) => {
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: mail.replyTo, subject: mail.subject, html: mail.html, text: mail.text }),
    });
    if (!response.ok) throw new Error(`Resend responded with ${response.status}`);
  };
}
