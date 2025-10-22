"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { useLang } from "../context/LangContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(
        t("Failed to send reset link.", "فشل في إرسال رابط الاستعادة.")
      );
    } else {
      toast.success(
        t(
          "Password reset link sent! Check your email.",
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني."
        )
      );
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {t("Forgot Password", "نسيت كلمة المرور")}
        </h2>

        <p className="text-center text-gray-600 text-sm mb-4">
          {t(
            "Enter your email address and we’ll send you a link to reset your password.",
            "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              className={`absolute ${
                lang === "ar" ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${
                lang === "ar" ? "pr-10" : "pl-10"
              } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
              placeholder="name@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t("Sending...", "جاري الإرسال...")}</span>
              </>
            ) : (
              t("Send Reset Link", "إرسال رابط الاستعادة")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
