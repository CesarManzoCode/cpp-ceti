import type { Metadata, Viewport } from "next";
import { Figtree, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import "./globals.css";
import { PRODUCT_NAME, PRODUCT_TAGLINE } from "@/lib/branding";

/**
 * Dos familias con papeles distintos:
 *
 * · Figtree — humanista, terminaciones abiertas, muy legible a 17px.
 *   Es la voz que explica. Toda la interfaz y toda la prosa.
 * · JetBrains Mono — sólo donde hay código real o una cifra que se
 *   compara (XP, contadores). Nunca como decoración.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: `${PRODUCT_NAME} — ${PRODUCT_TAGLINE}`,
    template: `%s · ${PRODUCT_NAME}`,
  },
  description:
    "Plataforma de práctica para estudiantes del CETI Guadalajara: cursos de programación con lecciones cortas, ejercicios reales y un editor de código en el navegador. No es un producto oficial del CETI.",
  keywords: [
    "CETI",
    "Guadalajara",
    "Desarrollo de Software",
    "aprender a programar",
    "curso de C++ en español",
    "programación orientada a objetos",
    "curso de C# en español",
  ],
  authors: [{ name: PRODUCT_NAME }],
  openGraph: {
    title: `${PRODUCT_NAME} — ${PRODUCT_TAGLINE}`,
    description:
      "Cursos de programación para estudiantes del CETI Guadalajara. Plataforma no oficial.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT_NAME,
    description:
      "Cursos de programación con lecciones interactivas y ejercicios reales en el navegador.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#13161f" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      suppressHydrationWarning
      className={`${figtree.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Sin JS, los bloques con reveal-on-scroll deben verse igualmente. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NavigationProgress />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
