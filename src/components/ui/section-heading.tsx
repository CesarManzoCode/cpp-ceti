import * as React from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

/**
 * Editorial section heading used across landing/app screens for consistent
 * typographic rhythm (eyebrow → title → description).
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      data-slot="section-heading"
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          <span className="size-1 rounded-full bg-primary" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance text-2xl font-semibold tracking-tight sm:text-3xl",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base",
            align === "center" && "max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
