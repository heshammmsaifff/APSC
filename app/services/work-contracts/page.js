"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/context/LangContext";
import Swal from "sweetalert2";

export default function WorkContractsPage() {
  const { user, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const t = (en, ar) => (lang === "ar" ? ar : en);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    contract_type: "",
    passport: null,
    personal_photo: null,
    cv: null,
    transfer_receipt: null,
  });

  const [submitting, setSubmitting] = useState(false);

  // ✅ لو المستخدم مش مسجل دخول
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

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
      setSubmitting(true);

      const passport_url = form.passport
        ? await uploadFile(form.passport, "work-contracts")
        : null;
      const personal_photo_url = form.personal_photo
        ? await uploadFile(form.personal_photo, "work-contracts")
        : null;
      const cv_url = form.cv
        ? await uploadFile(form.cv, "work-contracts")
        : null;
      const transfer_receipt_url = form.transfer_receipt
        ? await uploadFile(form.transfer_receipt, "work-contracts")
        : null;

      const { error } = await supabase
        .from("work_contract_applications")
        .insert([
          {
            user_id: user.id,
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            contract_type: form.contract_type,
            passport_url,
            personal_photo_url,
            cv_url,
            transfer_receipt_url,
          },
        ]);

      if (error) throw error;

      Swal.fire(
        t("Success ✅", "تم بنجاح ✅"),
        t(
          "Your application has been submitted successfully.",
          "تم إرسال طلبك بنجاح."
        ),
        "success"
      );

      setForm({
        full_name: "",
        email: "",
        phone: "",
        contract_type: "",
        passport: null,
        personal_photo: null,
        cv: null,
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
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        {t("Verifying your account...", "جاري التحقق من الحساب...")}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/work-contracts.jpg')" }}
    >
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="mt-35 mb-25 bg-white/70 shadow-lg rounded-2xl border border-gray-100 backdrop-blur-sm "
      >
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            {t(
              "Approved Work Contracts in Europe",
              "عقود عمل معتمدة في أوروبا"
            )}
          </h2>

          <label className="block mb-3 text-gray-700">
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

          <label className="block mb-3 text-gray-700">
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

          <label className="block mb-3 text-gray-700">
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

          <label className="block mb-3 text-gray-700">
            {t("Contract Type", "نوع العقد")}
          </label>
          <select
            name="contract_type"
            value={form.contract_type}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg mb-4"
          >
            <option value="">
              {t("Select Contract Type", "اختر نوع العقد")}
            </option>
            <option value="seasonal">
              {t("Seasonal Contract", "عقود موسمية")}
            </option>
            <option value="two_years">
              {t("Two-Year Contract", "عقود عامان")}
            </option>
          </select>

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
            {t("Personal Photo (White Background)", "صورة شخصية بخلفية بيضاء")}
          </label>
          <input
            type="file"
            name="personal_photo"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded-lg mb-4"
          />

          <label className="block mb-2 text-gray-700">
            {t(
              "CV (Including Experience & Certificates)",
              "السيرة الذاتية (تشمل الخبرات والشهادات)"
            )}
          </label>
          <input
            type="file"
            name="cv"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded-lg mb-4"
          />

          <label className="block mb-2 text-gray-700 whitespace-pre-line">
            {t(
              "Transfer receipt of $1000 USD to account number (0000)\n*Refundable if rejected",
              "إيصال تحويل مبلغ 1000 دولار أمريكي إلى رقم الحساب (0000)\n*يُسترد في حالة الرفض"
            )}
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
            disabled={submitting}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {submitting
              ? t("Submitting...", "جارٍ الإرسال...")
              : t("Submit Application", "إرسال الطلب")}
          </button>
        </form>
      </div>
    </div>
  );
}
