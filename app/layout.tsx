import type { Metadata } from "next";
import { Familjen_Grotesk, Instrument_Serif } from "next/font/google";
import { DEFAULT_LOCALE, getDictionary } from "@/lib/i18n";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Familjen_Grotesk({
  subsets: ["latin"],
  variable: "--font-familjen",
  display: "swap",
});

const dict = getDictionary(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: dict.meta.title,
  description: dict.meta.description,
  // Fase de validación: nada de esto debe indexarse todavía. Se quita cuando
  // haya producto que merezca tráfico → CLAUDE.md §35.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className={`${display.variable} ${sans.variable} grain antialiased`}>
        {children}
      </body>
    </html>
  );
}
