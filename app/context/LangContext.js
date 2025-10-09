"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ar");

  // ✅ دالة لتبديل اللغة وتخزينها في localStorage
  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === "ar" ? "en" : "ar";
      localStorage.setItem("lang", newLang);
      return newLang;
    });
  };

  useEffect(() => {
    // ✅ نحاول نقرأ اللغة من localStorage أولًا
    const savedLang = localStorage.getItem("lang");

    if (savedLang) {
      setLang(savedLang);
    } else {
      // لو مفيش، نستخدم لغة الجهاز لأول مرة فقط
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang.startsWith("en")) {
        setLang("en");
        localStorage.setItem("lang", "en");
      } else {
        setLang("ar");
        localStorage.setItem("lang", "ar");
      }
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
