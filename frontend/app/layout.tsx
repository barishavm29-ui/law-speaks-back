import type { Metadata } from "next";
import { NavBar } from "@/components/nav-bar";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Law Speaks Back — IHL & IHRL Research Platform",
  description:
    "A global digital research and civic-learning platform for International Humanitarian Law and International Human Rights Law: evidence, legal research, debate and policy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="paper-texture flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
