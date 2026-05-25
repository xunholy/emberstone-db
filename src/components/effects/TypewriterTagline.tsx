import * as React from 'react';

interface Props {
  phrases: string[];
  /** ms per char on type. */
  typeSpeed?: number;
  /** ms hold before deleting. */
  holdMs?: number;
  /** ms between phrase cycles. */
  cycleMs?: number;
  className?: string;
}

/**
 * Rotating typewriter that cycles phrases. Mostly atmosphere — used as
 * the hero sub-headline. Skips animation entirely under reduced motion.
 */
export function TypewriterTagline({
  phrases,
  typeSpeed = 60,
  holdMs = 1800,
  className
}: Props) {
  const [idx, setIdx] = React.useState(0);
  const [text, setText] = React.useState('');
  const [phase, setPhase] = React.useState<'typing' | 'holding' | 'deleting'>('typing');

  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setText(phrases[0] ?? '');
      return;
    }
    if (!phrases.length) return;

    const current = phrases[idx % phrases.length];

    if (phase === 'typing') {
      if (text.length < current.length) {
        const t = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('holding'), 80);
      return () => clearTimeout(t);
    }
    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), holdMs);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText(text.slice(0, -1)), typeSpeed / 1.8);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % phrases.length);
      setPhase('typing');
    }
  }, [text, phase, idx, phrases, typeSpeed, holdMs]);

  return (
    <span className={className}>
      {text}
      <span
        className="inline-block w-[1ch] -mr-[1ch] animate-caret-blink text-ember-400"
        aria-hidden="true"
      >|</span>
    </span>
  );
}
