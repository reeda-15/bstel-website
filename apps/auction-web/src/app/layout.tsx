import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Paddle Live Auctions",
  description: "Backend-connected live auction platform foundation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
