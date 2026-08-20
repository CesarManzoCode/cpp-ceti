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
 * Encabezado de sección del sitio público. El eyebrow va numerado y
 * monoespaciado, alineado a la izquierda por defecto: la página se lee
 * como un índice, no como una sucesión de slides centrados.
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
      {eyebrow ? (
        <span className="label-micro text-muted-foreground">{eyebrow}</span>
      ) : null}
      <h2 className="max-w-[22ch] text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.025em] sm:text-[34px]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
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
