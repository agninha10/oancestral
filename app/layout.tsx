import type { Metadata } from "next";
import { inter, crimsonPro } from "@/lib/fonts";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "O Ancestral - Estilo de Vida Ancestral",
    description:
      "Plataforma completa de estilo de vida ancestral: alimentação, dieta, treinos e jejum.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
