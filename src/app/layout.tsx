import type { Metadata } from "next";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "VINET ERP — Fotokitob va Vinetka ERP",
  description: "Fotokitob va vinetka ishlab chiqarish biznesi uchun to'liq ERP tizimi.",
  manifest: "/manifest.json",
  themeColor: "#0f62fe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
