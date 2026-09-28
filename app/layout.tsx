import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZELIO — Build the company. Skip the headcount.",
  description: "An AI operating system for solo founders.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
