"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "../../context/LangContext";

export default function InvestmentConsultingPage() {
  const router = useRouter();
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [investmentType, setInvestmentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ التحقق من تسجيل الدخول
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else setUser(data.user);
    };
    checkUser();
  }, [router]);

  // ✅ عند الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.from("investment_consulting").insert([
        {
          user_id: user.id,
          full_name: fullName,
          email,
          phone_number: phone,
          investment_type: investmentType,
          investment_budget: budget,
        },
      ]);

      if (error) throw error;

      setMessage("✅ تم إرسال طلبك بنجاح");
      setFullName("");
      setEmail("");
      setPhone("");
      setBudget("");
      setInvestmentType("");
    } catch (error) {
      console.error(error);
      setMessage("❌ حدث خطأ أثناء الإرسال");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        جاري التحقق من تسجيل الدخول...
      </div>
    );
  }

  const investmentOptions = [
    {
      ar: "الاستثمار العقاري (شراء عقارات في دول نشطة عقارياً)",
      en: "Real Estate (Buying properties in active markets)",
    },
    {
      ar: "الاستثمار التجاري (توفير السلع المطلوبة في الدول المستهلكة)",
      en: "Commercial Investment (Providing goods in consuming markets)",
    },
    {
      ar: "استثمارات متنوعة أخرى",
      en: "Other types of investments",
    },
  ];

  return (
    <div
      className="mt-15 relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/investing.jpg')" }}
    >
      {/* محتوى الفورم */}
      <div className="relative z-10 mt-10 max-w-2xl w-full mx-auto bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/60">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 drop-shadow-md">
          {lang === "ar"
            ? "الاستشارات الاستثمارية"
            : "Investment Consulting Services"}
        </h1>

        <p className="text-center text-gray-800 mb-6">
          {lang === "ar"
            ? "استشارات من قبل خبراء متخصصين في مختلف المجالات العقارية والتجارية وغيرها."
            : "Get professional consulting from experts in real estate, commerce, and more."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label={lang === "ar" ? "الاسم الكامل" : "Full Name"}
            value={fullName}
            onChange={setFullName}
            placeholder={
              lang === "ar" ? "اكتب اسمك الكامل" : "Enter your full name"
            }
          />

          <TextInput
            label={lang === "ar" ? "رقم الموبايل (واتساب)" : "WhatsApp Number"}
            value={phone}
            onChange={setPhone}
            type="tel"
          />

          <TextInput
            label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            value={email}
            onChange={setEmail}
            type="email"
            placeholder={
              lang === "ar" ? "example@email.com" : "Enter your email"
            }
          />

          {/* نوع الاستثمار */}
          <div>
            <label className="block mb-1 font-semibold text-gray-800">
              {lang === "ar" ? "نوع الاستثمار" : "Investment Type"}
            </label>
            <select
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {lang === "ar"
                  ? "اختر نوع الاستثمار"
                  : "Select investment type"}
              </option>
              {investmentOptions.map((opt, i) => (
                <option key={i} value={opt.ar}>
                  {lang === "ar" ? opt.ar : opt.en}
                </option>
              ))}
            </select>
          </div>

          <TextInput
            label={
              lang === "ar"
                ? "الميزانية المتاحة للاستثمار (بالدولار)"
                : "Available Investment Budget (USD)"
            }
            value={budget}
            onChange={setBudget}
            type="number"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-60 shadow-md"
          >
            {loading
              ? lang === "ar"
                ? "جارٍ الإرسال..."
                : "Submitting..."
              : lang === "ar"
              ? "إرسال الطلب"
              : "Submit Application"}
          </button>

          {message && (
            <p
              className={`text-center mt-4 font-semibold ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

/* 🔹 مكون إدخال نص */
function TextInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
