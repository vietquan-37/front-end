// components/ConditionalFooter.tsx (Client Component)

"use client"; // This component uses client-side hooks

import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const noFooterRoutes = ["/login", "/register", "/admin", "/admin/products", "/admin/users", "/admin/orders"];
  
  return !noFooterRoutes.includes(pathname) ? <Footer /> : null; 
}
