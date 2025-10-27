"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "../../context/LangContext";

export default function GlobalWorkVisasPage() {
  const router = useRouter();
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    drivingLicense: null,
    cv: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const countries = [
    { ar: "كندا", en: "Canada" },
    { ar: "ألمانيا", en: "Germany" },
    { ar: "أستراليا", en: "Australia" },
    { ar: "السويد", en: "Sweden" },
    { ar: "اليابان", en: "Japan" },
    { ar: "الولايات المتحدة", en: "United States" },
  ];

  // ✅ التحقق من تسجيل الدخول
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else setUser(data.user);
    };
    checkUser();
  }, [router]);

  const handleInput = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  // ✅ رفع ملف إلى التخزين
  const uploadFile = async (file, folder) => {
    if (!file) return null;
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`${folder}/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage
      .from("uploads")
      .getPublicUrl(`${folder}/${fileName}`);
    return publicUrl.publicUrl;
  };

  // ✅ عند الإرسال
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // رفع الملفات
      const photoUrl = await uploadFile(
        files.profilePhoto,
        "global-work-visas"
      );
      const licenseUrl = await uploadFile(
        files.drivingLicense,
        "global-work-visas"
      );
      const cvUrl = await uploadFile(files.cv, "global-work-visas");

      // إدخال البيانات
      const { error } = await supabase.from("global_work_visas").insert([
        {
          user_id: user.id,
          full_name: form.fullName,
          email: form.email,
          phone_number: form.phone,
          country: form.country,
          profile_photo_url: photoUrl,
          driving_license_url: licenseUrl,
          cv_url: cvUrl,
        },
      ]);

      if (error) throw error;

      setMessage("✅ تم إرسال الطلب بنجاح");
      setForm({ fullName: "", email: "", phone: "", country: "" });
      setFiles({ profilePhoto: null, drivingLicense: null, cv: null });
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
        {lang === "ar" ? "جارٍ التحقق من تسجيل الدخول..." : "Checking login..."}
      </div>
    );
  }

  return (
    <div
      className="mt-15 min-h-screen flex justify-center items-center py-10 px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/working.jpg')",
      }}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 drop-shadow-sm">
          {lang === "ar"
            ? "تأشيرات العمل لجميع دول العالم"
            : "Global Work Visas"}
        </h1>

        <p className="text-center text-gray-800 mb-6 font-medium">
          {lang === "ar"
            ? "يرجى إدخال البيانات وإرفاق المستندات المطلوبة."
            : "Please fill in your details and upload the required documents."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TextInput
            label={lang === "ar" ? "الاسم الكامل" : "Full Name"}
            value={form.fullName}
            onChange={(v) => handleInput("fullName", v)}
            placeholder={
              lang === "ar" ? "اكتب اسمك الكامل" : "Enter your full name"
            }
          />

          <TextInput
            label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            value={form.email}
            onChange={(v) => handleInput("email", v)}
            type="email"
            placeholder={
              lang === "ar" ? "example@email.com" : "Enter your email"
            }
          />

          <TextInput
            label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            value={form.phone}
            onChange={(v) => handleInput("phone", v)}
            type="tel"
          />

          <div>
            <label className="block mb-1 font-semibold text-gray-800">
              {lang === "ar" ? "الدولة المطلوبة" : "Target Country"}
            </label>
            <select
              value={form.country}
              onChange={(e) => handleInput("country", e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
            >
              <option value="">
                {lang === "ar" ? "اختر الدولة" : "Select Country"}
              </option>
              {countries.map((c) => (
                <option key={c.en} value={lang === "ar" ? c.ar : c.en}>
                  {lang === "ar" ? c.ar : c.en}
                </option>
              ))}
            </select>
          </div>

          <FileInput
            label={
              lang === "ar"
                ? "صورة شخصية 4×6 بخلفية بيضاء"
                : "Profile Photo (4x6 white background)"
            }
            onChange={(e) => handleFileChange(e, "profilePhoto")}
            required
          />

          <FileInput
            label={
              lang === "ar"
                ? "رخصة القيادة (إن وجدت)"
                : "Driving License (optional)"
            }
            onChange={(e) => handleFileChange(e, "drivingLicense")}
            required={false}
          />

          <FileInput
            label={lang === "ar" ? "السيرة الذاتية" : "CV"}
            onChange={(e) => handleFileChange(e, "cv")}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-60"
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

/* 🧩 مكوّن إدخال نص */
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

/* 🧩 مكوّن إدخال ملف */
function FileInput({ label, onChange, required = true }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        onChange={onChange}
        required={required}
        className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer 
          file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 
          file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
}
