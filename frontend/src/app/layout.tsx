import "./globals.scss";
import { Oswald } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Documentação de Serviços",
  description: "Sistema de documentação",
  icons: {
    icon: "/logoCoraxy1.png"
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${oswald.className} ${oswald.variable}`}>
        {children}
      </body>
    </html>
  );
}
