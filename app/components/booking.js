"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext";

export default function Booking() {
  const { lang } = useLang();
  const isArabic = lang === "ar";

  const title = isArabic ? "احجز تذاكرك" : "Book Your Tickets";
  const desc = isArabic
    ? "أنت على بعد خطوة واحدة من رحلتك! ماذا تنتظر؟"
    : "One step away from your trip! What are you waiting for?";
  const btn = isArabic ? "احجز الآن" : "Book Now";

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="flex flex-col md:flex-row items-center justify-between gap-10 px-6 md:px-20 py-16 bg-gray-100 overflow-hidden"
    >
      {/* النصوص مع أنيميشن */}
      <motion.div
        initial={{ opacity: 0, x: isArabic ? 80 : -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 text-center md:text-left"
      >
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-semibold mb-2 text-gray-800">{title}</h2>
          <hr
            className={`w-full border-orange-400 mb-4 ${
              isArabic ? "ml-auto" : "mr-auto"
            }`}
          />
          <p className="text-gray-600 mb-6 text-lg">{desc}</p>
          <Link href="/book">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-400 text-black font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-orange-300 transition"
            >
              {btn}
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* الصورة مع أنيميشن */}
      <motion.div
        initial={{ opacity: 0, x: isArabic ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex-1 flex justify-center"
      >
        <Image
          src="/booking.png"
          alt="Booking illustration"
          width={500}
          height={400}
          className="rounded-2xl shadow-xl object-contain"
        />
      </motion.div>
    </section>
  );
}
