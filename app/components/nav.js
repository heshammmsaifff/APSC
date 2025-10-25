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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {user.email?.[0].toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium hidden sm:block">
                  {user.email?.split("@")[0] || t("Account", "الحساب")}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-600 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute ${
                    lang === "ar" ? "left-0" : "right-0"
                  } mt-2 w-44 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-100`}
                >
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.121 17.804A7.975 7.975 0 0112 15c1.657 0 3.182.506 4.447 1.369M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t("Profile", "الملف الشخصي")}
                  </Link>

                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    {t("Logout", "تسجيل الخروج")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-400 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A7.975 7.975 0 0112 15c1.657 0 3.182.506 4.447 1.369M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {t("Login", "تسجيل الدخول")}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
