import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Revelation IT Training | Master Software Testing & Secure Your Dream IT Job",
  description:
    "Industry-leading IT training institute specializing in Software Testing, Automation, and career placement support.",
  keywords: [
    "Software Testing",
    "QA Training",
    "Automation Testing",
    "IT Courses",
    "Career Placement",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} scroll-smooth`}>
      <body className={`${lato.variable} font-sans bg-brand-bg text-brand-dark min-h-screen antialiased selection:bg-brand-orange/20 selection:text-brand-orange`}>
        {children}
      </body>
    </html>
  );
}
