import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";
import "./globals.css";

/**
 * IBM Plex: una sola superfamilia para interfaz y código. La mono es
 * hermana de diseño de la sans, así que los ordinales de la canaleta,
 * los contadores y el código conviven sin costura tipográfica.
 */
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "C++ CETI — Aprende C++ programando, no memorizando",
    template: "%s · C++ CETI",
  },
  description:
    "La plataforma interactiva de C++ hecha para estudiantes del CETI Guadalajara. Lecciones cortas, ejercicios reales y un editor de código en el navegador.",
  keywords: [
    "C++",
    "CETI",
    "Guadalajara",
    "Desarrollo de Software",
    "aprender a programar",
    "curso C++ en español",
    "ejercicios C++",
  ],
  authors: [{ name: "C++ CETI" }],
  openGraph: {
    title: "C++ CETI — Aprende C++ programando",
    description:
      "Plataforma interactiva de C++ para estudiantes del CETI Guadalajara.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "C++ CETI",
    description:
      "Aprende C++ con lecciones interactivas y ejercicios reales en el navegador.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#12151c" },
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
      className={`${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Sin JS, los bloques con reveal-on-scroll deben verse igualmente. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important}`}</style>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
