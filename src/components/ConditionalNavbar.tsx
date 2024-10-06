// components/ConditionalNavbar.tsx (Client Component)

"use client"; // This component uses client-side hooks

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const noNavbarRoutes = ["/login", "/register"];
  
  return !noNavbarRoutes.includes(pathname) ? <Navbar /> : null;
}
