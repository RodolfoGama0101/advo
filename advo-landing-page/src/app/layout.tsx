import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/animations.css";

const inter = Inter({
  variable: "--font-body-next",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-next",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const outfit = Outfit({
  variable: "--font-display-next",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ADVO — Sistema de Gestão Jurídica Moderno e Inteligente",
  description: "ADVO é a plataforma completa para escritórios de advocacia. Gerencie processos, prazos, tarefas em Kanban, agenda interativa e fluxo de caixa em um único sistema rápido e seguro.",
  keywords: ["sistema jurídico", "gestão advocacia", "software escritório advocacia", "controle processos", "kanban jurídico", "agenda advocacia"],
  authors: [{ name: "ADVO" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    title: "ADVO — Sistema de Gestão Jurídica Moderno e Inteligente",
    description: "A gestão jurídica do futuro, simples e em tempo real. Controle processos, prazos, tarefas e finanças em uma plataforma única.",
    url: "https://advo.com.br",
    siteName: "ADVO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
