"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLang } from "../context/LangContext";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("Passwords do not match.", "كلمتا المرور غير متطابقتين."));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(
        t("Failed to reset password.", "فشل في إعادة تعيين كلمة المرور.")
      );
    } else {
      toast.success(
        t("Password updated successfully!", "تم تحديث كلمة المرور بنجاح!")
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
          {t("Reset Password", "إعادة تعيين كلمة المرور")}
        </h2>

        <p className="text-center text-gray-600 text-sm mb-4">
          {t(
            "Enter your new password below.",
            "أدخل كلمة المرور الجديدة أدناه."
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* كلمة المرور الجديدة */}
          <div className="relative">
            <Lock
              className={`absolute ${
                lang === "ar" ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("New password", "كلمة المرور الجديدة")}
              className={`w-full ${
                lang === "ar" ? "pr-10" : "pl-10"
              } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${
                lang === "ar" ? "left-3" : "right-3"
              } top-1/2 transform -translate-y-1/2 text-gray-500`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative">
            <Lock
              className={`absolute ${
                lang === "ar" ? "right-3" : "left-3"
              } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
            />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t("Confirm password", "تأكيد كلمة المرور")}
              className={`w-full ${
                lang === "ar" ? "pr-10" : "pl-10"
              } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
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
                <span>{t("Resetting...", "جاري التعيين...")}</span>
              </>
            ) : (
              t("Reset Password", "إعادة التعيين")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
