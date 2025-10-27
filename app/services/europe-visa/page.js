"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "../../context/LangContext";

export default function EuropeVisaService() {
  const router = useRouter();
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState({
    passport: null,
    birthCertificate: null,
    bankStatement: null,
    utilityBill: null,
    personalPhoto: null,
    transferReceipt: null,
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

  // ✅ رفع الملف إلى supabase storage
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
      const passportUrl = await uploadFile(files.passport, "europe-visa");
      const birthCertUrl = await uploadFile(
        files.birthCertificate,
        "europe-visa"
      );
      const bankStmtUrl = await uploadFile(files.bankStatement, "europe-visa");
      const utilityBillUrl = await uploadFile(files.utilityBill, "europe-visa");
      const photoUrl = await uploadFile(files.personalPhoto, "europe-visa");
      const receiptUrl = await uploadFile(files.transferReceipt, "europe-visa");

      // إدخال البيانات في الجدول
      const { error } = await supabase.from("europe_visa_applications").insert([
        {
          user_id: user.id,
          full_name: fullName,
          email,
          phone_number: phone,
          passport_url: passportUrl,
          birth_certificate_url: birthCertUrl,
          bank_statement_url: bankStmtUrl,
          utility_bill_url: utilityBillUrl,
          personal_photo_url: photoUrl,
          transfer_receipt_url: receiptUrl,
        },
      ]);

      if (error) throw error;

      setMessage("✅ تم إرسال الملفات بنجاح");
      setFullName("");
      setEmail("");
      setPhone("");
      setFiles({
        passport: null,
        birthCertificate: null,
        bankStatement: null,
        utilityBill: null,
        personalPhoto: null,
        transferReceipt: null,
      });
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

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/europe-travel.jpg')" }}
    >
      <div className="mt-25 mb-25 max-w-2xl w-full bg-white/70 shadow-lg rounded-2xl p-8 border border-gray-100 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
          {lang === "ar"
            ? "تجهيز ملفات السياحة لأوروبا"
            : "Europe Visa File Preparation"}
        </h1>

        <p className="text-center text-gray-600 mb-6">
          {lang === "ar"
            ? "يرجى إرفاق جميع الملفات المطلوبة قبل الضغط على إرسال."
            : "Please upload all required documents before submitting."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم */}
          <TextInput
            label={lang === "ar" ? "الاسم الكامل" : "Full Name"}
            value={fullName}
            onChange={setFullName}
            placeholder={
              lang === "ar" ? "اكتب اسمك الكامل" : "Enter your full name"
            }
          />

          {/* البريد الإلكتروني */}
          <TextInput
            label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="example@email.com"
          />

          {/* رقم الهاتف */}
          <TextInput
            label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder={
              lang === "ar" ? "أدخل رقم الهاتف" : "Enter your phone number"
            }
          />

          <p className="m-5 font-bold text-green-800">
            {lang === "ar"
              ? "من فضلك تأكد من صحة البيانات و الملفات المرفقة"
              : "Please ensure the accuracy of the provided information and attached files."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileInput
              label={lang === "ar" ? "جواز السفر" : "Passport"}
              onChange={(e) => handleFileChange(e, "passport")}
            />
            <FileInput
              label={lang === "ar" ? "شهادة الميلاد" : "Birth Certificate"}
              onChange={(e) => handleFileChange(e, "birthCertificate")}
            />
            <FileInput
              label={
                lang === "ar"
                  ? "كشف حساب بنكي لاخر 6 شهور"
                  : "Bank Statement (Last 6 Months)"
              }
              onChange={(e) => handleFileChange(e, "bankStatement")}
            />
            <FileInput
              label={
                lang === "ar" ? "فاتورة مرافق حديثة" : "Recent Utility Bill"
              }
              onChange={(e) => handleFileChange(e, "utilityBill")}
            />
            <FileInput
              label={
                lang === "ar"
                  ? "صورة شخصية بخلفية بيضاء"
                  : "Personal Photo with White Background"
              }
              onChange={(e) => handleFileChange(e, "personalPhoto")}
            />
            <FileInput
              label={
                lang === "ar"
                  ? "إيصال تحويل المبلغ 150 دولار أمريكي"
                  : "Transfer Receipt of 150 USD"
              }
              onChange={(e) => handleFileChange(e, "transferReceipt")}
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
                : "Uploading..."
              : lang === "ar"
              ? "إرسال الملفات"
              : "Submit Files"}
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

/* 🔹 مكوّن إدخال نص */
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

/* 🔹 مكوّن إدخال ملف */
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
