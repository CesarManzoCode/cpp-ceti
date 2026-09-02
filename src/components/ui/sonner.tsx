"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster con identidad de marca:
 * - tipografía consistente con el resto de la app
 * - radius y sombras alineados a tokens
 * - tonos suaves para success/error/warning (no rich colors saturados)
 * - close-button siempre visible al hover
 * - en móvil sube por encima de la barra de navegación inferior
 */
function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      offset={16}
      // La nav móvil ocupa 4rem fijos abajo: sin este colchón el toast
      // aparece debajo de ella y se pierde.
      mobileOffset={{
        bottom: "calc(4rem + env(safe-area-inset-bottom) + 0.75rem)",
        left: "0.75rem",
        right: "0.75rem",
      }}
      gap={8}
      visibleToasts={4}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group/toast relative flex items-center gap-3 w-full rounded-[var(--radius-md)] border border-border-strong bg-popover px-4 py-3 text-[13px] text-popover-foreground shadow-[var(--shadow-lg)]",
          title: "text-[13px] font-medium leading-tight",
          description:
            "text-[12.5px] leading-snug text-muted-foreground mt-0.5",
          actionButton:
            "ml-auto inline-flex items-center justify-center h-7 px-3 rounded-[var(--radius-sm)] bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary-hover transition-colors",
          cancelButton:
            "inline-flex items-center justify-center h-7 px-3 rounded-[var(--radius-sm)] bg-secondary text-secondary-foreground text-[13px] font-semibold hover:bg-accent transition-colors",
          closeButton:
            "!absolute !right-1.5 !top-1.5 !size-6 !rounded-[var(--radius-xs)] !border-0 !bg-transparent !text-muted-foreground hover:!bg-accent hover:!text-foreground !transition-colors opacity-0 group-hover/toast:opacity-100",
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
