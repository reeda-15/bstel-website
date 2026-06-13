import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FloatingCta } from "@/components/FloatingCta";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "BSTEL Digital Solutions | Telecom Infrastructure Provider",
  description:
    "IP-1 licensed telecom infrastructure provider specializing in fibre-optic design, deployment and maintenance across India.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body suppressHydrationWarning>
        <ScrollReveal />
        <Header />
        {children}
        <Footer />
        <FloatingCta />
        <script src="/scripts/count-stats.js" async />
      </body>
    </html>
  );
}
