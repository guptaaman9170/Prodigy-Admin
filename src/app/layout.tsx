import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductOverlayProvider } from "@/context/ProductOverlayContext";

export const metadata: Metadata = {
  title: "PulseStack PRO | Enterprise Product Operations",
  description: "Enterprise Product Admin Dashboard built with Next.js, React 19, Tailwind CSS, and Axios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <ProductOverlayProvider>{children}</ProductOverlayProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
