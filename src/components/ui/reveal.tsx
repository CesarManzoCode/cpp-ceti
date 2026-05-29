"use client";

import * as React from "react";

/**
 * Reveals its content with a single fade-up the first time it enters the
 * viewport. Uses inline styles for the hide/show state so it does NOT depend
 * on Tailwind compound variants (which can silently fail to be generated for
 * data-[attr]: utilities), and degrades gracefully:
 *
 *   - Reduced motion: shown immediately.
 *   - Already in view on mount: shown immediately (no fade-in flash).
 *   - IO never fires: shown via a 2s safety fallback.
 *   - No JS at all: shown by the [data-reveal] noscript rule in app/layout.tsx.
 */
export function Reveal({
  className,
  style,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      queueMicrotask(() => setShown(true));
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      queueMicrotask(() => setShown(true));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);

    const fallback = window.setTimeout(() => setShown(true), 900);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 480ms cubic-bezier(0.25, 1, 0.5, 1), transform 480ms cubic-bezier(0.25, 1, 0.5, 1)",
        ...style,
      }}
      className={className}
      {...props}
    />
  );
}
