"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/app/context/LangContext";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function MiddleEastVisasPage() {
  const { user, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    passport: null,
    personal_photo: null,
    transfer_receipt: null,
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const t = (en, ar) => (lang === "ar" ? ar : en);

  // ✅ لو المستخدم مش مسجل دخول، نحوله للـ login
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const countries = [
    {
      name_en: "United Arab Emirates",
      name_ar: "الإمارات العربية المتحدة",
      price: 300,
    },
    {
      name_en: "Saudi Arabia",
      name_ar: "المملكة العربية السعودية",
      price: 250,
    },
    { name_en: "Qatar", name_ar: "قطر", price: 220 },
    { name_en: "Kuwait", name_ar: "الكويت", price: 200 },
    { name_en: "Bahrain", name_ar: "البحرين", price: 180 },
    { name_en: "Oman", name_ar: "عُمان", price: 200 },
    { name_en: "Jordan", name_ar: "الأردن", price: 150 },
    { name_en: "Lebanon", name_ar: "لبنان", price: 130 },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const uploadFile = async (file, folder) => {
    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file);
    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user)
      return Swal.fire(
        t("Login Required", "يجب تسجيل الدخول أولاً"),
        "",
        "warning"
      );

    try {
      setLoadingSubmit(true);

      const passport_url = form.passport
        ? await uploadFile(form.passport, "middleeast-visas")
        : null;
      const personal_photo_url = form.personal_photo
        ? await uploadFile(form.personal_photo, "middleeast-visas")
        : null;
      const transfer_receipt_url = form.transfer_receipt
        ? await uploadFile(form.transfer_receipt, "middleeast-visas")
        : null;

      const { error } = await supabase
        .from("middleeast_visa_applications")
        .insert([
          {
            user_id: user.id,
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            country: form.country,
            passport_url,
            personal_photo_url,
            transfer_receipt_url,
          },
        ]);

      if (error) throw error;

      Swal.fire(
        t("Success ✅", "تم بنجاح ✅"),
        t(
          "Your visa request has been sent successfully.",
          "تم إرسال طلبك بنجاح."
        ),
        "success"
      );

      setForm({
        full_name: "",
        email: "",
        phone: "",
        country: "",
        passport: null,
        personal_photo: null,
        transfer_receipt: null,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(
        t("Error ❌", "خطأ ❌"),
        t("An error occurred while submitting.", "حدث خطأ أثناء الإرسال."),
        "error"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="mt-15 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-10 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {t(
            "Tourist Visas & Hotel Bookings",
            "تأشيرات السياحة والحجوزات الفندقية في دول الشرق الأوسط"
          )}
        </h2>

        <label className="block mb-2 text-gray-700">
          {t("Full Name", "الاسم الكامل")}
        </label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">
          {t("Email", "البريد الإلكتروني")}
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">
          {t("Phone Number", "رقم الهاتف")}
        </label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">
          {t("Destination Country", "الدولة المطلوبة")}
        </label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        >
          <option value="">{t("Select Country", "اختر الدولة")}</option>
          {countries.map((c) => (
            <option key={c.name_en} value={c.name_en}>
              {lang === "ar"
                ? `${c.name_ar} - ${c.price} دولار`
                : `${c.name_en} - $${c.price}`}
            </option>
          ))}
        </select>

        {/* رفع الملفات */}
        <label className="block mb-2 text-gray-700">
          {t("Passport", "جواز السفر")}
        </label>
        <input
          type="file"
          name="passport"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">
          {t("Photo 4x6 (white background)", "صورة 4×6 بخلفية بيضاء")}
        </label>
        <input
          type="file"
          name="personal_photo"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">
          {t("Transfer Receipt", "إيصال تحويل المبلغ")}
          <br />
          <span className="text-gray-500 text-sm">
            {t(
              "Transfer the corresponding amount in USD to account (000000).",
              "يُرجى تحويل المبلغ المحدد بالدولار الأمريكي إلى رقم الحساب (000000)."
            )}
          </span>
        </label>
        <input
          type="file"
          name="transfer_receipt"
          onChange={handleFileChange}
          required
          className="w-full p-2 border rounded-lg mb-6"
        />

        <button
          type="submit"
          disabled={loadingSubmit}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
            loadingSubmit
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          }`}
        >
          {loadingSubmit
            ? t("Submitting...", "جارٍ الإرسال...")
            : t("Submit Request", "إرسال الطلب")}
        </button>
      </form>
    </div>
  );
}
