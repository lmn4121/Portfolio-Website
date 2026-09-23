import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
import Script from "next/script";
import { ChatWidget } from "@/components/ChatWidget";
import "./globals.css";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Landon Nguyen — Data Science | AI Engineering",
  description:
    "Portfolio of Landon Nguyen — data science student at UT Arlington building ML and LLM applications, from explainable neural networks to RAG systems and AI agents.",
  openGraph: {
    title: "Landon Nguyen — Data Science | AI Engineering",
    description:
      "Projects in explainable ML, computer vision, RAG, and agentic AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Script id="strip-twin-hash" strategy="beforeInteractive">
          {`if(location.hash==="#twin"){history.replaceState(null,"",location.pathname+location.search||"/");scrollTo(0,0);}`}
        </Script>
        {children}
        {/* Floating twin — after main content so it never owns the hero viewport */}
        <ChatWidget />
      </body>
    </html>
  );
}
