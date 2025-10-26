"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useLang } from "../context/LangContext";

export default function ContactPage() {
  const { lang } = useLang();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const t = {
    ar: {
      title: "📩 تواصل معنا",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال",
      sending: "جارٍ الإرسال...",
      success: "تم إرسال الرسالة بنجاح ✅",
      error: "حدث خطأ أثناء الإرسال",
      fillRequired: "من فضلك أكمل الحقول المطلوبة",
    },
    en: {
      title: "📩 Contact Us",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully ✅",
      error: "An error occurred while sending",
      fillRequired: "Please fill all required fields",
    },
  };

  const tr = t[lang];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.subject || !form.message) {
      toast.error(tr.fillRequired);
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contact_requests").insert([
      {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject,
        message: form.message,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error(tr.error);
    } else {
      toast.success(tr.success);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <div
      className={`max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow mt-24 ${
        lang === "ar" ? "text-right" : "text-left"
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">{tr.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">{tr.name} *</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{tr.email} *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{tr.phone}</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{tr.subject} *</label>
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">{tr.message} *</label>
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? tr.sending : tr.send}
        </button>
      </form>
    </div>
  );
}
