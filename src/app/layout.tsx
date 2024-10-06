// layout.tsx (Server Component with client-side logic separated)

import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; // Adjust the path if necessary
import ConditionalNavbar from "@/components/ConditionalNavbar"; // Use the new ConditionalNavbar component

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Providers>
          <ConditionalNavbar /> {/* Conditionally renders the Navbar */}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
