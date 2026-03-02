import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEOFocus - Análise SEO/AEO/GEO para seu Negócio",
  description: "Plataforma especializada em análise e otimização de websites para SEO, AEO (Answer Engine Optimization) e GEO (Generative Engine Optimization). Maximize sua visibilidade online.",
  keywords: ["SEO", "AEO", "GEO", "otimização", "análise de site", "marketing digital", "rankeamento Google", "featured snippets"],
  authors: [{ name: "SEOFocus Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SEOFocus - Análise SEO/AEO/GEO",
    description: "Maximize sua visibilidade online com análise especializada",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEOFocus - Análise SEO/AEO/GEO",
    description: "Maximize sua visibilidade online com análise especializada",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
