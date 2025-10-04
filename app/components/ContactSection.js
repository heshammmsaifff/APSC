"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext";

export default function ContactSection() {
  const { lang } = useLang();
  const isArabic = lang === "ar";
  const t = (en, ar) => (isArabic ? ar : en);

  const title = t("Contact us", "اتصل بنا");
  const desc = t(
    "Write to us and we will get back to you shortly.",
    "اكتب لنا وسنقوم بالرد عليك في أقرب وقت ممكن."
  );
  const btn = t("Contact", "تواصل");

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      className="w-full bg-white py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12"
    >
      {/* النص */}
      <motion.div
        initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
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
          <Link href="/contact">
            <button className="bg-orange-400 text-black font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-orange-300 transition">
              {btn}
            </button>
          </Link>
        </div>
      </motion.div>

      {/* الصورة */}
      <motion.div
        initial={{ opacity: 0, x: isArabic ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 flex justify-center"
      >
        <Image
          src="/Contact.png"
          alt="Contact illustration"
          width={500}
          height={400}
          className="rounded-2xl shadow-xl object-contain"
        />
      </motion.div>
    </section>
  );
}
