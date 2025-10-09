"use client";

import { useLang } from "../context/LangContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./nav";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const { lang } = useLang();
  const { user } = useAuth();

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className="antialiased flex flex-col min-h-screen bg-white text-gray-900">
        {/* ✅ شريط التنقل دائم */}
        <Navbar user={user} />

        {/* ✅ محتوى الصفحة */}
        <main className="flex-grow">{children}</main>

        {/* ✅ الفوتر دائم */}
        <Footer />
      </body>
    </html>
  );
}
