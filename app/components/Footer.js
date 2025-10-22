"use client";
import Link from "next/link";
import { useLang } from "../context/LangContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);
  const isArabic = lang === "ar";

  return (
    <footer
      className="bg-gray-900 text-gray-300 pt-12 pb-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1️⃣ العمود الأول - الشعار */}
          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-3">
              {t(
                "Arabistan Group Public Service",
                "عربستان جروب للخدمات العامة"
              )}
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              {t(
                "Your trusted partner for travel and public services.",
                "شريكك الموثوق لخدمات السفر والخدمات العامة."
              )}
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()}{" "}
              {t("All Rights Reserved.", "جميع الحقوق محفوظة.")}
            </p>
          </div>

          {/* 2️⃣ العمود الثاني - روابط سريعة */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("Quick Links", "روابط سريعة")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400 transition">
                  {t("Home", "الرئيسية")}
                </Link>
              </li>
              <li>
                <Link
                  href="/locations"
                  className="hover:text-orange-400 transition"
                >
                  {t("Destinations", "الوجهات")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-400 transition"
                >
                  {t("Contact Us", "اتصل بنا")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-orange-400 transition"
                >
                  {t("Book now!", "إحجز الآن!")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3️⃣ العمود الثالث - تواصل معنا */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              {t("Get in Touch", "تواصل معنا")}
            </h3>
            <p className="text-sm mb-4">
              {t(
                "Follow us on social media for the latest updates.",
                "تابعنا على وسائل التواصل الاجتماعي لأحدث الأخبار."
              )}
            </p>
            <div
              className={`flex ${
                isArabic ? "flex-row-reverse" : "flex-row"
              } gap-4`}
            >
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-orange-400 hover:text-black transition"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-orange-400 hover:text-black transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-orange-400 hover:text-black transition"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-orange-400 hover:text-black transition"
                aria-label="Whatsapp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* خط فاصل تحت */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
          {t(
            "Copyright © APSC | All Rights Reserved",
            "جميع الحقوق محفوظة © عربستان "
          )}
        </div>
      </div>
    </footer>
  );
}
