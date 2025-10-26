"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLang } from "../../context/LangContext";

export default function EventsService() {
  const router = useRouter();
  const { lang } = useLang();

  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [numGuests, setNumGuests] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [files, setFiles] = useState({
    idCard: null,
    venuePhotos: null,
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
      const idCardUrl = await uploadFile(files.idCard, "events-service");
      const venuePhotosUrl = await uploadFile(
        files.venuePhotos,
        "events-service"
      );
      const receiptUrl = await uploadFile(
        files.transferReceipt,
        "events-service"
      );

      const { error } = await supabase.from("events_service_requests").insert([
        {
          user_id: user.id,
          full_name: fullName,
          email,
          phone_number: phone,
          event_type: eventType,
          event_date: eventDate,
          location,
          num_guests: numGuests,
          special_requests: specialRequests,
          id_card_url: idCardUrl,
          venue_photos_url: venuePhotosUrl,
          transfer_receipt_url: receiptUrl,
        },
      ]);

      if (error) throw error;

      setMessage("✅ تم إرسال الطلب بنجاح");
      setFullName("");
      setEmail("");
      setPhone("");
      setEventType("");
      setEventDate("");
      setLocation("");
      setNumGuests("");
      setSpecialRequests("");
      setFiles({
        idCard: null,
        venuePhotos: null,
        transferReceipt: null,
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ حدث خطأ أثناء إرسال الطلب");
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
    <div className="mt-25 max-w-2xl mx-auto my-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        {lang === "ar"
          ? "خدمة تنظيم المؤتمرات و الحفلات و الرحلات السياحية"
          : "Event, Conference & Tour Organization Service"}
      </h1>

      <p className="text-center text-gray-600 mb-6">
        {lang === "ar"
          ? "يرجى إدخال جميع البيانات المطلوبة ورفع الملفات اللازمة قبل إرسال الطلب."
          : "Please fill all required fields and upload documents before submitting."}
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
          label={lang === "ar" ? "البريد الإلكتروني" : "Email"}
          value={email}
          onChange={setEmail}
          type="email"
          placeholder="example@email.com"
        />

        <TextInput
          label={lang === "ar" ? "رقم الهاتف" : "Phone Number"}
          value={phone}
          onChange={setPhone}
          type="tel"
          placeholder={
            lang === "ar" ? "أدخل رقم الهاتف" : "Enter your phone number"
          }
        />

        <SelectInput
          label={lang === "ar" ? "نوع الحدث" : "Event Type"}
          value={eventType}
          onChange={setEventType}
          options={
            lang === "ar"
              ? ["مؤتمر", "حفلة عامة", "رحلة سياحية"]
              : ["Conference", "Public Event", "Tour"]
          }
        />

        <TextInput
          label={lang === "ar" ? "تاريخ الحدث" : "Event Date"}
          value={eventDate}
          onChange={setEventDate}
          type="date"
        />

        <TextInput
          label={lang === "ar" ? "الموقع المقترح" : "Suggested Location"}
          value={location}
          onChange={setLocation}
          placeholder={
            lang === "ar" ? "اكتب موقع إقامة الحدث" : "Enter the event location"
          }
        />

        <TextInput
          label={lang === "ar" ? "عدد الحضور المتوقع" : "Expected Guests"}
          value={numGuests}
          onChange={setNumGuests}
          type="number"
          placeholder={
            lang === "ar" ? "اكتب عدد الحضور" : "Enter number of guests"
          }
        />

        <TextArea
          label={
            lang === "ar" ? "طلبات أو ملاحظات خاصة" : "Special Requests / Notes"
          }
          value={specialRequests}
          onChange={setSpecialRequests}
          placeholder={
            lang === "ar"
              ? "اكتب أي تفاصيل إضافية هنا"
              : "Add any special requirements or details"
          }
        />

        <p className="m-5 font-bold text-green-800">
          {lang === "ar"
            ? "يرجى التأكد من إرفاق المستندات المطلوبة التالية:"
            : "Please attach the required documents below:"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileInput
            label={lang === "ar" ? "الهوية الشخصية" : "ID Card"}
            onChange={(e) => handleFileChange(e, "idCard")}
          />
          <FileInput
            label={
              lang === "ar"
                ? "صور موقع الحدث (إن وجدت)"
                : "Event Venue Photos (if any)"
            }
            onChange={(e) => handleFileChange(e, "venuePhotos")}
          />
          <FileInput
            label={
              lang === "ar"
                ? "إيصال التحويل المسبق"
                : "Prepayment Transfer Receipt"
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
              : "Submitting..."
            : lang === "ar"
            ? "إرسال الطلب"
            : "Submit Request"}
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

/* 🔹 مكونات الإدخال */
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

function TextArea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows="4"
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FileInput({ label, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        onChange={onChange}
        className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer 
          file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 
          file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-1 font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
