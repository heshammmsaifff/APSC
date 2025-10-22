"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext";

export default function Hero() {
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const isArabic = lang === "ar";

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* 🎥 خلفية الفيديو */}
      <video
        src="/evening-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105 animate-slow-zoom"
      />

      {/* 🌫️ طبقة شفافة بتدرج */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* ✨ المحتوى */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
        {/* العنوان الرئيسي */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-4xl md:text-7xl font-light mb-6 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
        >
          {t(
            <>
              <span className="text-5xl block font-semibold mb-2 tracking-wide text-orange-400/90">
                Arabistan Group Public Service
              </span>
              <span className="text-5xl">
                Begin your{" "}
                <span className="text-orange-400 font-semibold">A</span>
                dventures with us
              </span>
            </>,
            <>
              <span className="block font-semibold mb-2 text-orange-400/90">
                عربستان جروب للخدمات العامة
              </span>
              <span>ابدأ مغامراتك معنا</span>
            </>
          )}
        </motion.h1>

        {/* الفقرة */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-2xl max-w-2xl mb-10 text-gray-100 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
        >
          {t(
            "Explore the world with us for the best travel experience",
            "استكشف العالم معنا للحصول على أفضل تجربة سفر"
          )}
        </motion.p>

        {/* الزر */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/locations">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer bg-orange-400 text-black font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-orange-300 transition-all"
            >
              {t("Explore Now!", "استكشف الآن!")}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
