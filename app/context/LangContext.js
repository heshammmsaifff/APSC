"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const toggleLang = () => setLang((prev) => (prev === "ar" ? "en" : "ar"));

  useEffect(() => {
    // نفحص لغة المتصفح
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith("en")) {
      setLang("en");
    } else {
      setLang("ar");
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
