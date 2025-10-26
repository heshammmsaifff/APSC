"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useLang } from "@/app/context/LangContext"; // ✅ المسار الصحيح

export default function FlightTicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { lang } = useLang(); // ✅ استخدم hook الجاهز بدل useContext

  const t = {
    ar: {
      title: "توفير تذاكر الطيران بأرخص الأسعار",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      passport: "إرفاق جواز السفر",
      fromAirport: "من مطار",
      toAirport: "إلى مطار",
      fromDate: "من تاريخ",
      toDate: "إلى تاريخ",
      submit: "إرسال الطلب",
      submitting: "جارٍ الإرسال...",
      successTitle: "تم بنجاح ✅",
      successMsg: "تم إرسال طلبك بنجاح.",
      errorTitle: "خطأ ❌",
      errorMsg: "حدث خطأ أثناء الإرسال.",
      mustLogin: "يجب تسجيل الدخول أولاً.",
      checking: "جاري التحقق من الحساب...",
    },
    en: {
      title: "Find the Cheapest Flight Tickets",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      passport: "Attach Passport",
      fromAirport: "From Airport",
      toAirport: "To Airport",
      fromDate: "From Date",
      toDate: "To Date",
      submit: "Submit Request",
      submitting: "Submitting...",
      successTitle: "Success ✅",
      successMsg: "Your flight request has been submitted successfully.",
      errorTitle: "Error ❌",
      errorMsg: "An error occurred while submitting.",
      mustLogin: "You must log in first.",
      checking: "Verifying your account...",
    },
  }[lang || "ar"];

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    from_airport: "",
    to_airport: "",
    date_from: "",
    date_to: "",
    passport: null,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.files[0] });

  const uploadFile = async (file, folder) => {
    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
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
    if (!user) return Swal.fire("تنبيه", t.mustLogin, "warning");

    try {
      setSubmitting(true);

      const passport_url = form.passport
        ? await uploadFile(form.passport, "flight-tickets")
        : null;

      const { error } = await supabase.from("flight_ticket_requests").insert([
        {
          user_id: user.id,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          from_airport: form.from_airport,
          to_airport: form.to_airport,
          date_from: form.date_from,
          date_to: form.date_to,
          passport_url,
        },
      ]);

      if (error) throw error;

      Swal.fire(t.successTitle, t.successMsg, "success");

      setForm({
        full_name: "",
        email: "",
        phone: "",
        from_airport: "",
        to_airport: "",
        date_from: "",
        date_to: "",
        passport: null,
      });
    } catch (err) {
      console.error(err);
      Swal.fire(t.errorTitle, t.errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        {t.checking}
      </div>
    );
  }

  if (!user) return null;

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
          {t.title}
        </h2>

        <label className="block mb-2 text-gray-700">{t.fullName}</label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">{t.email}</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">{t.phone}</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-gray-700">{t.fromAirport}</label>
            <input
              type="text"
              name="from_airport"
              value={form.from_airport}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-gray-700">{t.toAirport}</label>
            <input
              type="text"
              name="to_airport"
              value={form.to_airport}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
        </div>
        <p className="mt-6 text-green-800 font-bold">
          {lang === "ar"
            ? "أدخل متوسط تاريخ الرحلة و سنرسل لك الرحلات المتاحة إلي وجهتك خلال الفترة المحددة."
            : "Enter the average flight date and we will send you available flights to your destination during the specified period."}
        </p>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-2 text-gray-700">{t.fromDate}</label>
            <input
              type="date"
              name="date_from"
              value={form.date_from}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-gray-700">{t.toDate}</label>
            <input
              type="date"
              name="date_to"
              value={form.date_to}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg mb-4"
            />
          </div>
        </div>

        <label className="block mb-2 text-gray-700">{t.passport}</label>
        <input
          type="file"
          name="passport"
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
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  );
}
