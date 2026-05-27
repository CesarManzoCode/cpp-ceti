import * as React from "react";

import { cn } from "@/lib/utils";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";

interface SectionHeadingProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

/**
 * Section heading editorial:
 *   eyebrow (uppercase 11px) → title (3xl-4xl) → description (15px)
 *   Tighter stack, more deliberate spacing.
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
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? <ConsoleEyebrow tone="primary">{eyebrow}</ConsoleEyebrow> : null}
      <h2 className="text-balance text-[28px] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
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
