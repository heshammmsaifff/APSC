"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "../../context/LangContext";

export default function GlobalJobsPage() {
  const router = useRouter();
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [profession, setProfession] = useState("");
  const [experience, setExperience] = useState("");
  const [files, setFiles] = useState({
    idOrResidence: null,
    cv: null,
  });
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

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  // ✅ رفع الملفات
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
      const idOrResidenceUrl = await uploadFile(
        files.idOrResidence,
        "global-jobs"
      );
      const cvUrl = await uploadFile(files.cv, "global-jobs");

      const { error } = await supabase.from("global_jobs_applications").insert([
        {
          user_id: user.id,
          full_name: fullName,
          email,
          phone_number: phone,
          country,
          profession,
          experience_years: experience,
          id_or_residence_url: idOrResidenceUrl,
          cv_url: cvUrl,
        },
      ]);

      if (error) throw error;

      setMessage("✅ تم إرسال طلبك بنجاح");
      setFullName("");
      setEmail("");
      setPhone("");
      setCountry("");
      setProfession("");
      setExperience("");
      setFiles({ idOrResidence: null, cv: null });
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

  const countries = [
    "كندا",
    "ألمانيا",
    "أستراليا",
    "السويد",
    "هولندا",
    "الإمارات",
    "قطر",
    "السعودية",
  ];

  return (
    <div className="mt-15 max-w-2xl mx-auto my-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        {lang === "ar"
          ? "توفير العمل في جميع دول العالم"
          : "Global Job Opportunities"}
      </h1>

      <p className="text-center text-gray-600 mb-6">
        {lang === "ar"
          ? "يرجى تعبئة البيانات بدقة وإرفاق الملفات المطلوبة."
          : "Please fill in your details carefully and upload the required documents."}
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
          label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
          value={phone}
          onChange={setPhone}
          type="tel"
          placeholder={lang === "ar" ? "0123456789" : "Enter your phone number"}
        />

        <TextInput
          label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
          value={email}
          onChange={setEmail}
          type="email"
          placeholder={lang === "ar" ? "example@email.com" : "Enter your email"}
        />

        {/* اختيار الدولة */}
        <div>
          <label className="block mb-1 font-semibold">
            {lang === "ar" ? "اختر الدولة" : "Select Country"}
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              {lang === "ar" ? "اختر الدولة" : "Choose a country"}
            </option>
            {countries.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <TextInput
          label={lang === "ar" ? "المهنة" : "Profession"}
          value={profession}
          onChange={setProfession}
          placeholder={
            lang === "ar" ? "مثلاً: مهندس برمجيات" : "e.g. Software Engineer"
          }
        />

        <TextInput
          label={lang === "ar" ? "عدد سنوات الخبرة" : "Years of Experience"}
          value={experience}
          onChange={setExperience}
          type="number"
          placeholder={lang === "ar" ? "مثلاً: 5" : "e.g. 5"}
        />

        {/* الملفات */}
        <p>برجاء ارفاق الهوية اذا كنت مواطن - الإقامة اذا كنت أجنبي</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileInput
            label={lang === "ar" ? "الهوية / الإقامة" : "ID or Residence"}
            onChange={(e) => handleFileChange(e, "idOrResidence")}
          />
          <FileInput
            label={lang === "ar" ? "السيرة الذاتية" : "CV / Resume"}
            onChange={(e) => handleFileChange(e, "cv")}
          />
        </div>

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

/* 🔹 مكون إدخال ملف */
function FileInput({ label, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        onChange={onChange}
        required
        className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer 
          file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 
          file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
}
