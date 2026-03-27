import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "JehTattooer | Tatuagens Florais e Fineline em Florianópolis",
  description: "Especialista em tatuagens delicadas, fineline, e florais em Florianópolis, SC. Agende seu horário com Jéssica Barboza no Centro de Floripa.",
  keywords: ["Tatuagem floral Florianópolis", "Fineline tattoo Florianópolis", "Tatuadora delicada Florianópolis", "JehTattooer Florianópolis", "Tatuagem feminina Florianópolis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
