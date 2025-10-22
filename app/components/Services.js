"use client";
import { motion } from "framer-motion";
import { useLang } from "../context/LangContext";
import {
  FaPlane,
  FaTag,
  FaHotel,
  FaShieldAlt,
  FaPassport,
  FaGlobe,
} from "react-icons/fa";
export default function Services() {
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const services = [
    {
      icon: <FaPlane className="text-4xl text-orange-500" />,
      title: t("Best Flights", "أفضل الرحلات الجوية"),
      desc: t(
        "Find the most comfortable and affordable flights to your destination.",
        "اعثر على الرحلات الجوية الأكثر راحة والأفضل سعرًا إلى وجهتك."
      ),
    },
    {
      icon: <FaTag className="text-4xl text-orange-500" />,
      title: t("Best Deals", "أفضل العروض"),
      desc: t(
        "Exclusive travel deals and discounts tailored for you.",
        "عروض سفر حصرية وخصومات مميزة مصممة خصيصًا لك."
      ),
    },
    {
      icon: <FaHotel className="text-4xl text-orange-500" />,
      title: t("Hotels", "الفنادق"),
      desc: t(
        "Stay in top-rated hotels at affordable prices.",
        "أقم في فنادق عالية التقييم بأسعار مناسبة."
      ),
    },
    {
      icon: <FaShieldAlt className="text-4xl text-orange-500" />,
      title: t("Safe Travels", "سفر آمن"),
      desc: t(
        "We prioritize your safety and comfort at every step.",
        "نضع سلامتك وراحتك في المقام الأول في كل خطوة."
      ),
    },
    {
      icon: <FaPassport className="text-4xl text-orange-500" />,
      title: t("Europe Travel Files", "تجهيز ملفات السياحة إلى أوروبا"),
      desc: t(
        "Complete assistance with preparing and organizing your Europe travel documents.",
        "نقدّم لك كل المساعدة في تجهيز وتنظيم ملفات السفر إلى أوروبا."
      ),
    },
    {
      icon: <FaGlobe className="text-4xl text-orange-500" />,
      title: t(
        "Visas & Middle East Bookings",
        "توفير تأشيرات السياحة والحجوزات الفندقية لدول الشرق الأوسط"
      ),
      desc: t(
        "We handle tourist visas and hotel bookings across Middle Eastern destinations.",
        "نقوم بتوفير تأشيرات السياحة والحجوزات الفندقية لمختلف دول الشرق الأوسط."
      ),
    },
  ];

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="w-full bg-gray-50 py-20 text-center"
    >
      {/* عنوان القسم */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800"
      >
        {t("Have a look at our services!", "تعرّف على خدماتنا!")}
      </motion.h2>

      {/* الكروت */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 md:px-16">
        {services.map((srv, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-8 flex flex-col items-center text-center"
          >
            {srv.icon}
            <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800">
              {srv.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{srv.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* زر عرض جميع الخدمات */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <a
          href="/services"
          className="inline-block  bg-orange-500 hover:bg-orange-400 hover:scale-90 text-white font-medium py-3 px-8 rounded-full shadow hover:from-blue-700 hover:to-indigo-700 transition"
        >
          {t("View All Services", "عرض جميع الخدمات")}
        </a>
      </motion.div>
    </section>
  );
}
