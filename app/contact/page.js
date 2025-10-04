"use client";
import { useLang } from "../context/LangContext";

export default function Contact() {
  const { lang } = useLang(); // نجيب اللغة الحالية
  const t = (en, ar) => (lang === "en" ? en : ar); // دالة الترجمة

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="h-[500px] flex justify-center items-center bg-amber-500"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
        {t("This is the contact page", "هنا صفحة التواصل")}
      </h1>
    </section>
  );
}
