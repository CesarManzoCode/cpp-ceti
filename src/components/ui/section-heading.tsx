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
 * Section heading editorial limpio:
 *  • eyebrow tipo "section_label" pequeño y discreto
 *  • title en Inter Bold + tracking-tight (cálido, premium)
 *  • description opcional con leading relaxed
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
      {eyebrow ? <ConsoleEyebrow>{eyebrow}</ConsoleEyebrow> : null}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
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
