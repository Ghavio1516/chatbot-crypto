import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Chatbot by Ghavio",
  description: "Cuan cuan cuan",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${inter.className} h-full bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100`}>
        {children}
      </body>
    </html>
  );
}
