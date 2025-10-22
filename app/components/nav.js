"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { useLang } from "../context/LangContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { lang, toggleLang } = useLang();
  const { user, signOut } = useAuth();

  const t = (en, ar) => (lang === "en" ? en : ar);

  // ✅ تأثير التمرير
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ إغلاق القائمة المنسدلة عند النقر بالخارج
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: t("Home", "الرئيسية"), href: "/" },
    { label: t("Book", "احجز"), href: "/services" },
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
          className="text-4xl font-bold tracking-wide justify-center flex items-center"
          dir="ltr"
        >
          <span className="text-orange-400">A</span>GPS
        </Link>
      </div>

      {/* زر الموبايل */}
      <button
        onClick={() => setOpen(!open)}
        className="text-orange-400 text-2xl md:hidden"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* روابط القائمة */}
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

        {/* تبديل اللغة */}
        <li>
          <button
            onClick={toggleLang}
            className={`px-3 py-1 border rounded-md transition ${
              scrolled
                ? "bg-orange-500/20 border-orange-500 text-orange-100 hover:bg-orange-500 hover:text-black"
                : "bg-orange-500/20 border-orange-500 text-orange-300 hover:bg-orange-500 hover:text-black"
            }`}
          >
            {lang === "en" ? "العربية" : "English"}
          </button>
        </li>

        {/* حساب المستخدم */}
        <li className="relative" ref={dropdownRef}>
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-orange-400 font-medium hover:text-orange-300 transition"
              >
                <User className="w-5 h-5" />
                {user.email?.split("@")[0] || t("Account", "الحساب")}
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute ${
                    lang === "ar" ? "left-0" : "right-0"
                  } mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50`}
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {t("Profile", "الملف الشخصي")}
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                  >
                    {t("Logout", "تسجيل الخروج")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-orange-500 text-black px-3 py-1 rounded-md hover:bg-orange-400 transition"
            >
              {t("Login", "تسجيل الدخول")}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
