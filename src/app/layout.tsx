import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductOverlayProvider } from "@/context/ProductOverlayContext";

export const metadata: Metadata = {
  title: "Prodigy Admin | Product Management Dashboard",
  description: "High-performance Product Admin Dashboard built with Next.js, Tailwind CSS, and Axios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <ProductOverlayProvider>{children}</ProductOverlayProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
