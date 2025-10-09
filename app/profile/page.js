"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/app/context/LangContext";
import { User, Mail, Phone } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);

  const t = (en, ar) => (lang === "ar" ? ar : en);

  // ✅ التأكد من تسجيل الدخول
  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user) setLoadingProfile(false);
  }, [user, loading, router]);

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {t("Loading...", "جاري التحميل...")}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ✅ جلب البيانات من metadata
  const name =
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    t("Unknown user", "مستخدم غير معروف");
  const email = user.email;
  const phone = user.user_metadata?.phone || t("Not provided", "غير محدد");

  // ممكن مستقبلاً تضيف user.user_metadata.avatar_url لو عندك صور للمستخدمين
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4"
    >
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
        {/* صورة المستخدم */}
        <div className="flex justify-center mb-6">
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-md">
              {name[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t("Profile", "الملف الشخصي")}
        </h2>
        <p className="text-gray-500 mb-6">
          {t("Welcome to your account", "مرحبًا بك في حسابك")}
        </p>

        {/* بيانات المستخدم */}
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <User className="text-blue-600 w-5 h-5" />
            <span className="text-gray-700">{name}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Mail className="text-indigo-600 w-5 h-5" />
            <span className="text-gray-700">{email}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Phone className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">{phone}</span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="mt-8 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all"
        >
          {t("Sign out", "تسجيل الخروج")}
        </button>
      </div>
    </div>
  );
}
