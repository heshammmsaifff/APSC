"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext";

export default function BestSelling() {
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const places = [
    {
      name: t("Dubai", "دبي"),
      img: "/dubaibg.jpg",
      desc: t(
        "City of luxury, adventure, and modern wonders.",
        "مدينة الفخامة والمغامرة والمعالم الحديثة."
      ),
    },
    {
      name: t("Thailand", "تايلاند"),
      img: "/thailandbg.jpg",
      desc: t(
        "Tropical paradise with beaches and rich culture.",
        "جنة استوائية بشواطئ ساحرة وثقافة غنية."
      ),
    },
    {
      name: t("Paris", "باريس"),
      img: "/parisbg.jpg",
      desc: t(
        "The city of love, lights, and art.",
        "مدينة الحب والأنوار والفن."
      ),
    },
    {
      name: t("Maldives", "المالديف"),
      img: "/maldivesbg.jpg",
      desc: t(
        "Crystal-clear waters and peaceful resorts.",
        "مياه نقية ومنتجعات هادئة."
      ),
    },
  ];

  // إعدادات الأنيميشن
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-full py-20 bg-white text-center overflow-hidden"
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800"
      >
        {t("Best Selling Destinations", "أفضل الوجهات مبيعًا")}
      </motion.h2>

      {/* الكروت */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-16">
        {places.map((place, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            {/* الصورة */}
            <div className="relative overflow-hidden">
              <Image
                src={place.img}
                alt={place.name}
                width={400}
                height={300}
                priority
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* النصوص */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {place.name}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {place.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* زر عرض المزيد */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <Link href="/locations">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-orange-400 hover:shadow-lg transition font-semibold">
            {t("View More", "عرض المزيد")}
          </button>
        </Link>
      </motion.div> */}
    </section>
  );
}
