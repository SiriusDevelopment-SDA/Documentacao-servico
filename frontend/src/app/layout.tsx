import "./globals.scss";
import { Oswald } from "next/font/google";
import type { ReactNode } from "react";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata = {
  title: "Documentação de Serviços",
  description: "Sistema de documentação",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${oswald.className} ${oswald.variable}`}>
        {children}
      </body>
    </html>
  );
}
