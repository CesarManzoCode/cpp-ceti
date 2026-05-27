import * as React from "react";

import { cn } from "@/lib/utils";
import { ConsoleEyebrow } from "@/components/ui/console-eyebrow";

interface SectionHeadingProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /**
   * Treatment for the title. "display" uses the Editorial Compiler
   * mono-bold uppercase look; "editorial" keeps a humanist Inter title
   * for warm/marketing moments.
   */
  variant?: "display" | "editorial";
}

/**
 * Section heading used across landing/app screens. The "display" variant
 * is the brand's signature: console-eyebrow + mono uppercase title +
 * hairline underline.
 */
function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  variant = "display",
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
      {eyebrow ? <ConsoleEyebrow>{eyebrow}</ConsoleEyebrow> : null}

      {variant === "display" ? (
        <h2 className="text-balance font-display text-[28px] leading-[1.05] sm:text-[36px]">
          {title}
        </h2>
      ) : (
        <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      )}

      {variant === "display" ? (
        <span
          aria-hidden
          className={cn(
            "block h-px bg-gradient-to-r from-border via-border to-transparent",
            align === "center"
              ? "mx-auto w-24"
              : "w-full max-w-[40%]",
          )}
        />
      ) : null}

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
