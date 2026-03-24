import type { Metadata } from "next";
import { inter, crimsonPro } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import GoogleAnalytics from "@/components/google-analytics";
import MetaPixel from "@/components/meta-pixel"
import UtmTracker from "@/components/utm-tracker";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://oancestral.com.br'),
  title: {
    default: "O Ancestral - Estilo de Vida Ancestral",
    template: "%s | O Ancestral",
  },
  description:
    "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum. Transforme sua saúde com sabedoria ancestral e ciência moderna.",
  keywords: [
    "dieta ancestral",
    "alimentação ancestral",
    "jejum intermitente",
    "treino funcional",
    "estilo de vida saudável",
    "carnívora",
    "low carb",
    "cetogênica",
  ],
  authors: [{ name: "O Ancestral" }],
  creator: "O Ancestral",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://oancestral.com.br",
    siteName: "O Ancestral",
    title: "O Ancestral - Estilo de Vida Ancestral",
    description:
      "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum.",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "O Ancestral — Estilo de Vida Ancestral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O Ancestral - Estilo de Vida Ancestral",
    description:
      "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum.",
    images: ["/images/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favcon.png',
    shortcut: '/favcon.png',
    apple: '/favcon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}
      >
        <GoogleAnalytics gaId="G-ET36Z6XQZZ" />
        <MetaPixel />
        <UtmTracker />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <GoogleOneTap />
            {children}
          </ThemeProvider>
        </SessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
