import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairSharely EDU",
  description: "Zajedničko planiranje studentskih projekata"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr-Latn">
      <body>{children}</body>
    </html>
  );
}
