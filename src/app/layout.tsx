import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f14" },
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
      className={`${inter.variable} ${jetbrainsMono.variable}`}
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
