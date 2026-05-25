import * as React from 'react';

interface Props {
  to: number;
  /** Optional preformatted suffix (e.g. ",000" or "k"). Leave blank for plain integer. */
  suffix?: string;
  /** Animation duration in ms. */
  durationMs?: number;
  className?: string;
}

/**
 * IntersectionObserver-gated counter — only animates once the element
 * is on screen, so off-screen stats don't burn frames on long pages.
 * Uses requestAnimationFrame with an ease-out curve.
 */
export function AnimatedCounter({ to, suffix = '', durationMs = 1400, className }: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(0);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setValue(to); return; }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const step = (t: number) => {
              const p = Math.min(1, (t - start) / durationMs);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.round(to * eased));
              if (p < 1) requestAnimationFrame(step);
              else setValue(to);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}{suffix}
    </span>
  );
}
