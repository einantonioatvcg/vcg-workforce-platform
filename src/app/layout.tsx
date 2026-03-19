import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VCG Workforce | Plataforma B2B",
  description: "Análisis Cartográfico y Demográfico de ENOE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fontSans.className} ${fontMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950`}
      >
        {children}
      </body>
    </html>
  );
}
