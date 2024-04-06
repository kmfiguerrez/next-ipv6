import type { Metadata } from "next";
import "./globals.css";
import { montserrat } from "@/lib/fonts";

import { ThemeProvider } from "@/components/theme-color/theme-provider"



export const metadata: Metadata = {
  title: "IPv6 Subnetting",
  description: "Static app built using Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${montserrat.className} bg-neutral-100 dark:bg-zinc-900`}>
        <ThemeProvider 
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
