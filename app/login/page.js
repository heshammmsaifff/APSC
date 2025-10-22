"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff, User, Phone } from "lucide-react";
import { useLang } from "../context/LangContext";
import { toast } from "react-hot-toast";

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+20",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const router = useRouter();
  const { lang } = useLang();
  const t = (en, ar) => (lang === "en" ? en : ar);

  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // تسجيل الدخول
        const { error } = await signIn(form.email, form.password);
        if (error) {
          toast.error(
            t(error.message || "Login failed.", "فشل تسجيل الدخول."),
            { duration: 4000 }
          );
          setError(error.message);
        } else {
          toast.success(t("Login successful!", "تم تسجيل الدخول بنجاح!"), {
            duration: 3000,
          });
          router.push("/");
        }
      } else {
        // إنشاء حساب جديد
        const phoneFull = `${form.countryCode}${form.phone}`;
        const { data, error } = await signUp(
          form.email,
          form.password,
          form.name,
          phoneFull
        );

        if (error) {
          toast.error(
            t(error.message || "Registration failed.", "فشل إنشاء الحساب."),
            { duration: 4000 }
          );
          setError(error.message);
        } else {
          toast.success(
            t(
              "Account created successfully! Please check your email to verify your account.",
              "تم إنشاء الحساب بنجاح! من فضلك تحقق من بريدك الإلكتروني لتأكيد الحساب."
            ),
            { duration: 6000 }
          );
          setIsLogin(true); // رجعه لصفحة تسجيل الدخول
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isLogin
          ? t("Login failed.", "فشل تسجيل الدخول.")
          : t("Registration failed.", "فشل إنشاء الحساب."),
        { duration: 4000 }
      );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { code: "+20", name: t("Egypt", "مصر") },
    { code: "+966", name: t("Saudi Arabia", "السعودية") },
    { code: "+971", name: t("UAE", "الإمارات") },
    { code: "+962", name: t("Jordan", "الأردن") },
    { code: "+965", name: t("Kuwait", "الكويت") },
    { code: "+973", name: t("Bahrain", "البحرين") },
    { code: "+968", name: t("Oman", "عُمان") },
    { code: "+964", name: t("Iraq", "العراق") },
    { code: "+961", name: t("Lebanon", "لبنان") },
  ];

  if (user) return null;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isLogin
            ? t("Sign In", "تسجيل الدخول")
            : t("Create Account", "إنشاء حساب")}
        </h2>

        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* الاسم */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Full Name", "الاسم الكامل")}
                </label>
                <div className="relative">
                  <User
                    className={`absolute ${
                      lang === "ar" ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                  />
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full ${
                      lang === "ar" ? "pr-10" : "pl-10"
                    } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                    placeholder={t("Your name", "اسمك")}
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Phone Number", "رقم الهاتف")}
                </label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="relative flex-1">
                    <Phone
                      className={`absolute ${
                        lang === "ar" ? "right-3" : "left-3"
                      } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className={`w-full ${
                        lang === "ar" ? "pr-10" : "pl-10"
                      } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                      placeholder={t("123456789", "123456789")}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Email Address", "البريد الإلكتروني")}
            </label>
            <div className="relative">
              <Mail
                className={`absolute ${
                  lang === "ar" ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className={`w-full ${
                  lang === "ar" ? "pr-10" : "pl-10"
                } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Password", "كلمة المرور")}
            </label>
            <div className="relative">
              <Lock
                className={`absolute ${
                  lang === "ar" ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className={`w-full ${
                  lang === "ar" ? "pr-10" : "pl-10"
                } px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none`}
                placeholder="••••••••"
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
          </div>

          {/* الزر */}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-blue-600 hover:underline"
              >
                {t("Forgot your password?", "نسيت كلمة المرور؟")}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  {isLogin
                    ? t("Signing in...", "جاري الدخول...")
                    : t("Creating account...", "جاري إنشاء الحساب...")}
                </span>
              </>
            ) : isLogin ? (
              t("Sign In", "تسجيل الدخول")
            ) : (
              t("Create Account", "إنشاء حساب")
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? (
            <>
              {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-medium hover:underline"
              >
                {t("Create one", "إنشاء حساب")}
              </button>
            </>
          ) : (
            <>
              {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-medium hover:underline"
              >
                {t("Sign in", "تسجيل الدخول")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
