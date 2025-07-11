import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SessionProvider } from "@/components/session-provider";
import { Analytics } from "@/components/analytics";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Esmaeil Abedi - Personal Website & Blog",
  description:
    "Personal website and blog of Esmaeil Abedi, software developer and writer.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider defaultTheme="system" storageKey="theme">
            <div className="relative flex min-h-screen flex-col h-screen overflow-scroll">
              <SiteHeader />
              <Suspense>
                <div className="flex-1">{children}</div>
              </Suspense>
              <SiteFooter />
            </div>
          </ThemeProvider>
        </SessionProvider>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
