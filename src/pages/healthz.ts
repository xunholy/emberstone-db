// Simple liveness/readiness endpoint for the k8s probes. Lives at
// /db/healthz because of Astro's `base: '/db'` setting. Returns 200
// "ok" without touching any data layer so a healthy probe doesn't
// depend on snapshot integrity.

export const prerender = false;

export function GET() {
  return new Response('ok\n', {
    status: 200,
    headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' },
  });
}
