"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLang();

  const t = (en, ar) => (lang === "en" ? en : ar);

  // ✅ مراقبة التمرير
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("Home", "الرئيسية"), href: "/" },
    { label: t("Book", "احجز"), href: "/book" },
    { label: t("Locations", "الوجهات"), href: "/locations" },
    { label: t("Contact", "اتصل بنا"), href: "/contact" },
  ];

  return (
    <nav
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 w-full transition-all duration-500 z-50 ${
        scrolled ? "bg-black/70 backdrop-blur-md shadow-md" : "bg-black/90"
      } text-white flex items-center justify-between px-6 py-4`}
    >
      {/* Logo */}
      <div className="flex flex-col">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide flex items-center"
          dir="ltr"
        >
          <span className="text-orange-400">A</span>BSC
        </Link>
        <p className="text-xs text-gray-300 tracking-widest">
          {t("Travel made easy", "السفر أصبح أسهل")}
        </p>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="text-orange-400 text-2xl md:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Links */}
      <ul
        className={`${
          open
            ? "left-0 opacity-100"
            : "-left-full opacity-0 md:opacity-100 md:left-auto"
        } absolute md:static bg-black/90 md:bg-transparent top-[70px] md:top-auto w-full md:w-auto flex flex-col md:flex-row md:items-center gap-4 p-6 md:p-0 transition-all duration-500`}
      >
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-orange-400 text-center flex justify-center transition-colors duration-300"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}

        {/* Language Switch */}
        <li>
          <button
            onClick={toggleLang}
            className={`${
              scrolled
                ? "px-3 py-1 bg-orange-500/20 border border-orange-500 rounded-md text-orange-100 hover:bg-orange-500 hover:text-black transition"
                : "px-3 py-1 bg-orange-500/20 border border-orange-500 rounded-md text-orange-300 hover:bg-orange-500 hover:text-black transition"
            }`}
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
