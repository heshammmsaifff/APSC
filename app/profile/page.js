"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/app/context/LangContext";
import { User, Mail, Phone, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const t = (en, ar) => (lang === "ar" ? ar : en);

  // ✅ التأكد من تسجيل الدخول
  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (!loading && user) setLoadingProfile(false);
  }, [user, loading, router]);

  // ✅ جلب الطلبات الخاصة بالمستخدم
  useEffect(() => {
    if (!user) return;

    const fetchAllApplications = async () => {
      setLoadingApps(true);

      const tables = [
        {
          name: "europe_visa_applications",
          label: t("Europe Visa Files", "تجهيز ملفات تأشيرات أوروبا"),
        },
        {
          name: "flight_ticket_requests",
          label: t("Flight Ticket Requests", "طلبات تذاكر الطيران"),
        },
        {
          name: "global_jobs_applications",
          label: t("Global Job Applications", "طلبات توفير فرص عمل"),
        },
        {
          name: "global_work_visas",
          label: t("Global Work Visas", "تأشيرات العمل لجميع الدول"),
        },
        {
          name: "investment_consulting",
          label: t("Investment Consulting", "الاستشارات الاستثمارية"),
        },
        {
          name: "middleeast_visa_applications",
          label: t("Middle East Visas", "تأشيرات الشرق الأوسط"),
        },
        {
          name: "work_contract_applications",
          label: t("Work Contracts", "عقود العمل في أوروبا"),
        },
      ];

      let all = [];

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table.name)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn(`⚠️ Error fetching ${table.name}:`, error.message);
        } else if (data?.length) {
          all.push(
            ...data.map((d) => ({
              ...d,
              serviceName: table.label,
              tableName: table.name,
            }))
          );
        }
      }

      all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setApplications(all);
      setLoadingApps(false);
    };

    fetchAllApplications();
  }, [user]);

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

  const name =
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    t("Unknown user", "مستخدم غير معروف");
  const email = user.email;
  const phone = user.user_metadata?.phone || t("Not provided", "غير محدد");
  const avatar = user.user_metadata?.avatar_url;

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 flex flex-col items-center"
    >
      {/* ✅ بطاقة المستخدم */}
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
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
            <span className="text-gray-700" dir="ltr">
              {phone}
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="mt-8 w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all"
        >
          {t("Sign out", "تسجيل الخروج")}
        </button>
      </div>

      {/* ✅ الطلبات */}
      <div className="max-w-3xl w-full mt-10 bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="text-blue-600" />
          {t("Your Applications", "طلباتك المقدمة")}
        </h3>

        {loadingApps ? (
          <div className="flex justify-center py-6 text-gray-500">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            {t("Loading applications...", "جاري تحميل الطلبات...")}
          </div>
        ) : applications.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            {t(
              "You haven't submitted any applications yet.",
              "لم تقدم أي طلبات بعد."
            )}
          </p>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
              >
                <p className="text-sm text-gray-700 mb-1">
                  <strong>{t("Service Type", "نوع الخدمة")}:</strong>{" "}
                  {app.serviceName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>{t("Application ID", "رقم الطلب")}:</strong>{" "}
                  <span className="font-mono text-gray-900">{app.id}</span>
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>{t("Submitted on", "تاريخ التقديم")}:</strong>{" "}
                  {new Date(app.created_at).toLocaleString("ar-EG")}
                </p>
                <p className="text-green-600 mt-2 text-sm">
                  {t(
                    "We'll contact you soon to update your application status.",
                    "سيتم التواصل معكم قريبًا لإخطاركم بحالة الطلب."
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
