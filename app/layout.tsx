import { CustomNavbar } from "@/components/custom/customeNavbar";
import TRPCProvider from "@/components/TRPCProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OCM Tennis - Site Officiel",
  description:
    "Site officiel de l'OCM tennis à Montauban-de-Bretagne (Ille-et-Vilaine). Retrouvez les actualités, les résultats et les informations sur le club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TRPCProvider>
          <CustomNavbar />
          {children}
        </TRPCProvider>
      </body>
    </html>
  );
}
