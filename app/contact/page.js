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
      title: "تواصل معنا",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال",
      sending: "جارٍ الإرسال...",
      success: "تم إرسال الرسالة بنجاح",
      error: "حدث خطأ أثناء الإرسال",
      fillRequired: "من فضلك أكمل الحقول المطلوبة",
    },
    en: {
      title: "Contact Us",
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully",
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
      className="mt-15 min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ backgroundImage: "url('/contact.jpg')" }}
    >
      <div
        className={`max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition-all hover:shadow-blue-200 ${
          lang === "ar" ? "text-right" : "text-left"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          {tr.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "full_name", label: tr.name, required: true },
            { name: "email", label: tr.email, type: "email", required: true },
            { name: "phone", label: tr.phone },
            { name: "subject", label: tr.subject, required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {field.label}
                {field.required && " *"}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {tr.message} *
            </label>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <p className="font-bold text-green-800">
            {lang === "ar"
              ? "عند الضغط الضفط علي ارسال سيتم استقبال رسالتك و التواصل معك بأقرب وقت ممكن"
              : "By clicking send, your message will be received and we will get back to you as soon as possible."}
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
          >
            {loading ? tr.sending : tr.send}
          </button>
        </form>
      </div>
    </div>
  );
}
