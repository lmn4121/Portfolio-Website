import type { Metadata } from "next";
import { Syne, Figtree } from "next/font/google";
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
  title: "Landon Nguyen — Data Scientist | AI Engineering",
  description:
    "Portfolio of Landon Nguyen — data science student at UT Arlington focused on machine learning, computer vision, and AI engineering.",
  openGraph: {
    title: "Landon Nguyen — Data Scientist | AI Engineering",
    description:
      "Projects in predictive modeling, computer vision, Kaggle datathons, and agentic AI.",
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
      <body>{children}</body>
    </html>
  );
}
