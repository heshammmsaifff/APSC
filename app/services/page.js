"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLang } from "../context/LangContext"; // ← حسب مكان ملف الكونتِكست عندك
import {
  FaPassport,
  FaPlaneDeparture,
  FaBriefcase,
  FaGlobeEurope,
  FaHandshake,
  FaChartLine,
  FaCalendarAlt,
  FaGlobe,
} from "react-icons/fa";

export default function ServicesPage() {
  const { lang } = useLang();

  const services = [
    {
      slug: "europe-visa",
      icon: <FaGlobeEurope className="text-6xl text-orange-500" />,
      title: {
        ar: "تجهيز ملفات السياحة لأوروبا",
        en: "Preparing Europe Travel Files",
      },
      desc: {
        ar: "نساعدك في تجهيز كافة الأوراق والمستندات المطلوبة للحصول على تأشيرات السياحة الأوروبية بسهولة وسرعة.",
        en: "We help you prepare all the required documents to obtain European tourist visas quickly and easily.",
      },
    },
    {
      slug: "work-contracts",
      icon: <FaBriefcase className="text-6xl text-orange-500" />,
      title: {
        ar: "عقود عمل معتمدة في أوروبا",
        en: "Certified Work Contracts in Europe",
      },
      desc: {
        ar: "نوفر عقود عمل موثوقة وقانونية في الدول الأوروبية بمختلف التخصصات.",
        en: "We provide reliable and legal work contracts across European countries in various fields.",
      },
    },
    {
      slug: "middleeast-visas",
      icon: <FaPassport className="text-6xl text-orange-500" />,
      title: {
        ar: "تأشيرات السياحة والحجوزات الفندقية للشرق الأوسط",
        en: "Tourist Visas & Hotel Bookings for the Middle East",
      },
      desc: {
        ar: "احصل على تأشيرات السفر والحجوزات الفندقية بسهولة وأمان لأي دولة في الشرق الأوسط.",
        en: "Get travel visas and hotel bookings easily and safely for any Middle Eastern country.",
      },
    },
    {
      slug: "flight-tickets",
      icon: <FaPlaneDeparture className="text-6xl text-orange-500" />,
      title: {
        ar: "تذاكر الطيران بأرخص الأسعار",
        en: "Cheap Flight Tickets",
      },
      desc: {
        ar: "نقارن بين مئات الرحلات لتوفير أفضل الأسعار بأمان وضمان.",
        en: "We compare hundreds of flights to provide the best and safest ticket prices.",
      },
    },
    {
      slug: "global-work-visas",
      icon: <FaHandshake className="text-6xl text-orange-500" />,
      title: {
        ar: "توفير تأشيرات العمل لجميع دول العالم",
        en: "Work Visas for All Countries",
      },
      desc: {
        ar: "خدمات متكاملة لاستخراج تأشيرات العمل والإجراءات القانونية للعمل في أي دولة تختارها.",
        en: "End-to-end services to obtain work visas and handle legal procedures for any country you choose.",
      },
    },
    {
      slug: "global-jobs",
      icon: <FaGlobe className="text-6xl text-orange-500" />,
      title: {
        ar: "توفير فرص العمل في جميع دول العالم",
        en: "Job Opportunities Worldwide",
      },
      desc: {
        ar: "نوفر فرص عمل حقيقية مع شركات وشركاء حول العالم متناسبة مع مهاراتك وخبراتك.",
        en: "We provide real job opportunities with partners and companies worldwide that match your skills and experience.",
      },
    },
    {
      slug: "investment-consulting",
      icon: <FaChartLine className="text-6xl text-orange-500" />,
      title: {
        ar: "الاستشارات الاستثمارية من خبراء متخصصين",
        en: "Investment Consulting by Expert Advisors",
      },
      desc: {
        ar: "استشارات استثمارية متخصصة من فريق خبراء لمساعدتك في اتخاذ قرارات مالية واستثمارية مدروسة.",
        en: "Specialized investment advice from a team of experts to help you make well-informed financial and investment decisions.",
      },
    },
    {
      slug: "events-and-travel",
      icon: <FaCalendarAlt className="text-6xl text-orange-500" />,
      title: {
        ar: "تجهيز وتنظيم الحفلات والمؤتمرات والرحلات",
        en: "Events, Conferences & Travel Planning",
      },
      desc: {
        ar: "تنظيم شامل للفعاليات والحفلات العامة والمؤتمرات والرحلات السياحية، من التخطيط حتى التنفيذ.",
        en: "Full-service planning for events, public parties, conferences and tour packages — from planning to execution.",
      },
    },
  ];

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat py-20 px-6 md:px-20"
      style={{ backgroundImage: "url('/services.jpg')" }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* طبقة التظليل */}
      <div className="absolute inset-0 bg-black/30"></div>
      {/* العنوان */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-20"
      >
        {lang === "ar" ? "خدماتنا" : "Our Services"}
      </motion.h1>

      <div className="flex flex-col gap-12">
        {services.map((srv, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-10 flex flex-col md:flex-row items-center justify-between overflow-hidden"
          >
            {/* خلفية متدرجة خفيفة */}
            <div className="absolute inset-0 bg-gradient-to-l from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

            {/* الأيقونة */}
            <div className="z-10 mb-6 md:mb-0 md:mx-8 flex-shrink-0">
              {srv.icon}
            </div>

            {/* المحتوى */}
            <div className="z-10 text-center md:text-right flex-1 md:mx-6">
              <h3 className="text-2xl font-bold mb-3 text-gray-800">
                {lang === "ar" ? srv.title.ar : srv.title.en}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {lang === "ar" ? srv.desc.ar : srv.desc.en}
              </p>
            </div>

            {/* الزر */}
            <div className="z-10 mt-6 md:mt-0 md:mx-8">
              <Link
                href={`/services/${srv.slug}`}
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-full shadow-md transition-all hover:scale-95 font-medium"
              >
                {lang === "ar" ? "التقديم على الخدمة" : "Apply for Service"}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
