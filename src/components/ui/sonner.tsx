"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster con identidad de marca:
 * - tipografía consistente con el resto de la app
 * - radius y sombras alineados a tokens
 * - tonos suaves para success/error/warning (no rich colors saturados)
 * - close-button siempre visible al hover
 */
function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      offset={16}
      gap={8}
      visibleToasts={4}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group/toast relative flex items-center gap-3 w-full rounded-[var(--radius-lg)] border border-border bg-popover px-4 py-3 text-[13px] text-popover-foreground shadow-[var(--shadow-lg)] backdrop-blur",
          title: "text-[13px] font-medium leading-tight tracking-tight",
          description:
            "text-[12.5px] leading-snug text-muted-foreground mt-0.5",
          actionButton:
            "ml-auto inline-flex items-center justify-center h-7 px-3 rounded-[var(--radius-sm)] bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/92 transition-colors",
          cancelButton:
            "inline-flex items-center justify-center h-7 px-3 rounded-[var(--radius-sm)] bg-secondary text-secondary-foreground text-xs font-medium hover:bg-accent transition-colors",
          closeButton:
            "!absolute !right-1.5 !top-1.5 !size-6 !rounded-full !border-0 !bg-transparent !text-muted-foreground hover:!bg-accent hover:!text-foreground !transition-colors opacity-0 group-hover/toast:opacity-100",
          success:
            "[&_[data-icon]>svg]:!text-success [&_[data-icon]]:!text-success border-success/30",
          error:
            "[&_[data-icon]>svg]:!text-destructive [&_[data-icon]]:!text-destructive border-destructive/30",
          warning:
            "[&_[data-icon]>svg]:!text-warning [&_[data-icon]]:!text-warning border-warning/30",
          info:
            "[&_[data-icon]>svg]:!text-info [&_[data-icon]]:!text-info border-info/30",
          loading:
            "[&_[data-icon]>svg]:!text-primary [&_[data-icon]]:!text-primary",
          icon:
            "shrink-0 [&>svg]:size-4",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--popover)",
          "--error-bg": "var(--popover)",
          "--warning-bg": "var(--popover)",
          "--info-bg": "var(--popover)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
