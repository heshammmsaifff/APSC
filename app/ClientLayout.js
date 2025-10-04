"use client";

import { useLang } from "./context/LangContext";
import Navbar from "./components/nav";
import Footer from "./components/Footer";

export default function ClientLayout({ children }) {
  const { lang } = useLang();

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className="bg-white text-gray-900 transition-colors duration-300">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
