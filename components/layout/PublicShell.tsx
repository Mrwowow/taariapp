"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname === "/login" || pathname === "/register";

  if (isAdmin || isAuth) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
