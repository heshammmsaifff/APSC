"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ar");

  const toggleLang = () => {
    setLang((prev) => {
      const newLang = prev === "ar" ? "en" : "ar";
      localStorage.setItem("lang", newLang);
      return newLang;
    });
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language || navigator.userLanguage;
      const defaultLang = browserLang.startsWith("en") ? "en" : "ar";
      setLang(defaultLang);
      localStorage.setItem("lang", defaultLang);
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
