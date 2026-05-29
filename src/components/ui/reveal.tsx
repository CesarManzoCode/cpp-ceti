"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Reveals its content with a single fade-up the first time it enters the
 * viewport — so entrance motion is spent where the user can actually see it,
 * not played off-screen on initial load. Honors prefers-reduced-motion (the
 * content is simply shown, no transform) and degrades to visible if the
 * observer never fires.
 */
export function Reveal({ className, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Under reduced motion the content is already visible (the motion-safe
    // guard never zeroes opacity), so there is nothing to observe or animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-shown={shown || undefined}
      className={cn(
        "motion-safe:opacity-0 motion-safe:data-[shown]:animate-fade-up",
        className,
      )}
      {...props}
    />
  );
}
