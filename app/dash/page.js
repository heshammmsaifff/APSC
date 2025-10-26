"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const OWNER_EMAILS = ["heshamsaif856@gmail.com"];

const SERVICES = {
  users: {
    key: "users",
    title: "المستخدمين المسجلين",
    table: "user_profiles",
    displayFields: ["display_name", "phone", "email"],
    dateField: null,
    fileFields: [],
  },
  europeVisa: {
    key: "europeVisa",
    title: "تجهيز ملفات السياحة لأوروبا",
    table: "europe_visa_applications",
    displayFields: ["full_name", "phone_number", "email"],
    dateField: "created_at",
    fileFields: [
      ["جواز السفر", "passport_url"],
      ["شهادة الميلاد", "birth_certificate_url"],
      ["كشف الحساب البنكي", "bank_statement_url"],
      ["فاتورة الخدمات", "utility_bill_url"],
      ["الصورة الشخصية", "personal_photo_url"],
      ["إيصال التحويل", "transfer_receipt_url"],
    ],
  },
  middleeastVisa: {
    key: "middleeastVisa",
    title: "تأشيرات السياحة والحجوزات الفندقية للشرق الأوسط",
    table: "middleeast_visa_applications",
    displayFields: ["full_name", "phone", "email"],
    dateField: "created_at",
    fileFields: [
      ["جواز السفر", "passport_url"],
      ["الصورة الشخصية", "personal_photo_url"],
      ["إيصال التحويل", "transfer_receipt_url"],
    ],
  },
  flightTickets: {
    key: "flightTickets",
    title: "طلبات تذاكر الطيران",
    table: "flight_ticket_requests",
    displayFields: ["full_name", "phone", "email"],
    dateField: "created_at",
    fileFields: [["جواز السفر", "passport_url"]],
  },
  globalJobs: {
    key: "globalJobs",
    title: "طلبات توفير فرص العمل",
    table: "global_jobs_applications",
    displayFields: ["full_name", "phone_number", "email"],
    dateField: "created_at",
    fileFields: [
      ["بطاقة/هجرة", "id_or_residence_url"],
      ["السيرة الذاتية", "cv_url"],
    ],
  },
  workVisas: {
    key: "workVisas",
    title: "توفير تأشيرات العمل لجميع دول العالم",
    table: "global_work_visas",
    displayFields: ["full_name", "phone_number", "email"],
    dateField: "created_at",
    fileFields: [
      ["الصورة الشخصية", "profile_photo_url"],
      ["رخصة القيادة", "driving_license_url"],
      ["السيرة الذاتية", "cv_url"],
    ],
  },
  investment: {
    key: "investment",
    title: "استشارات الاستثمار",
    table: "investment_consulting",
    displayFields: ["full_name", "phone_number", "email"],
    dateField: "created_at",
    fileFields: [],
  },
  workContracts: {
    key: "workContracts",
    title: "عقود عمل معتمدة في أوروبا",
    table: "work_contract_applications",
    displayFields: ["full_name", "phone", "email", "contract_type"],
    dateField: "created_at",
    fileFields: [
      ["جواز السفر", "passport_url"],
      ["الصورة الشخصية", "personal_photo_url"],
      ["السيرة الذاتية", "cv_url"],
      ["إيصال التحويل", "transfer_receipt_url"],
    ],
  },
  eventOrganization: {
    key: "eventOrganization",
    title: "تجهيز وتنظيم المؤتمرات والحفلات العامة والرحلات السياحية",
    table: "events_service_requests",

    displayFields: [
      "full_name",
      "phone_number",
      "email",
      "event_type",
      "special_requests",
    ],
    dateField: "created_at",
    fileFields: [
      ["بطاقة الهوية أو جواز السفر", "id_card_url"],
      ["صور المكان / القاعة", "venue_photos_url"],
      ["إيصال التحويل", "transfer_receipt_url"],
    ],
  },
};

export default function DashboardPage() {
  const router = useRouter();

  const [sessionChecked, setSessionChecked] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState("users");
  const [rows, setRows] = useState([]); // current tab rows
  const [loadingRows, setLoadingRows] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // for modal
  const [error, setError] = useState(null);

  // Check session + owner
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          // Not logged in
          router.push("/login");
          return;
        }

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        const email = currentUser.email ?? "";
        if (OWNER_EMAILS.includes(email)) {
          setIsOwner(true);
          // load initial tab
          loadTabData("users");
        } else {
          // Not owner -> redirect away (or show forbidden)
          router.push("/");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("فشل في التحقق من الجلسة.");
        router.push("/login");
      } finally {
        setSessionChecked(true);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load data whenever activeTab changes
  useEffect(() => {
    if (!isOwner) return;
    loadTabData(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isOwner]);

  async function loadTabData(tabKey) {
    const service = Object.values(SERVICES).find((s) => s.key === tabKey);
    if (!service) return;
    setLoadingRows(true);
    setError(null);
    setRows([]);
    try {
      // build select clause: pick display fields + date + file fields
      const selectFields = new Set();
      (service.displayFields || []).forEach((f) => selectFields.add(f));
      if (service.dateField) selectFields.add(service.dateField);
      (service.fileFields || []).forEach((pair) => selectFields.add(pair[1]));
      // always include id
      selectFields.add("id");

      const selectClause = Array.from(selectFields).join(",");

      const { data, error: fetchError } = await supabase
        .from(service.table)
        .select(selectClause)
        .order(service.dateField ?? "id", { ascending: false })
        .limit(500);

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        setError(fetchError.message || "خطأ في جلب البيانات");
      } else {
        setRows(data || []);
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ غير متوقع عند جلب البيانات.");
    } finally {
      setLoadingRows(false);
    }
  }

  function openModal(row) {
    setSelectedRow(row);
    // scroll top of modal if needed (browser default)
  }

  function closeModal() {
    setSelectedRow(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (!sessionChecked) {
    return <div className="p-6">جارٍ التحقق من الجلسة...</div>;
  }

  if (!isOwner) {
    return <div className="p-6">جارٍ التحقق من صلاحياتك...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex mt-20">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">لوحة التحكم</h1>
            <p className="text-sm text-gray-500">عرض خدمات الموقع (Owner)</p>
          </div>
          <div className="text-xs text-gray-400">مرحبا</div>
        </div>

        <nav className="flex-1 overflow-auto">
          {Object.values(SERVICES).map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveTab(s.key)}
              className={`w-full text-right px-3 py-2 rounded-md mb-2 transition ${
                activeTab === s.key
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t">
          <div className="text-xs text-gray-500 mb-2">{user?.email ?? ""}</div>
          <div className="flex gap-2">
            <button
              onClick={() => loadTabData(activeTab)}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded"
            >
              تحديث
            </button>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {SERVICES[activeTab].title}
          </h2>
          <div className="text-sm text-gray-500">
            عدد السجلات: {rows.length}
          </div>
        </header>

        <section className="bg-white rounded-xl shadow p-4 border">
          {error && (
            <div className="mb-4 text-sm text-red-600">حدث خطأ: {error}</div>
          )}

          {loadingRows ? (
            <div className="p-6 text-center text-gray-600">جارٍ التحميل...</div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا توجد سجلات</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-right text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    {/* dynamic headers: displayFields */}
                    {SERVICES[activeTab].displayFields.map((f) => (
                      <th key={f} className="p-2 border capitalize">
                        {fieldLabel(f)}
                      </th>
                    ))}
                    {SERVICES[activeTab].dateField && (
                      <th className="p-2 border">تاريخ</th>
                    )}
                    <th className="p-2 border">عرض التفاصيل</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t hover:bg-gray-50">
                      {SERVICES[activeTab].displayFields.map((f) => (
                        <td key={f} className="p-2 border">
                          {displayCellValue(row[f])}
                        </td>
                      ))}

                      {SERVICES[activeTab].dateField && (
                        <td className="p-2 border">
                          {formatDate(row[SERVICES[activeTab].dateField])}
                        </td>
                      )}

                      <td className="p-2 border text-center">
                        <button
                          onClick={() => openModal(row)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          عرض
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Modal */}
      {selectedRow && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-6 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">
                  تفاصيل:{" "}
                  {selectedRow.full_name ||
                    selectedRow.display_name ||
                    selectedRow.id}
                </h3>
                <p className="text-sm text-gray-500">ID: {selectedRow.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                إغلاق
              </button>
            </div>

            {/* show basic fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {SERVICES[activeTab].displayFields.map((f) => (
                <div key={f} className="text-sm">
                  <div className="text-xs text-gray-500">{fieldLabel(f)}</div>
                  <div className="mt-1">{displayCellValue(selectedRow[f])}</div>
                </div>
              ))}

              {SERVICES[activeTab].dateField && (
                <div className="text-sm">
                  <div className="text-xs text-gray-500">تاريخ</div>
                  <div className="mt-1">
                    {formatDate(selectedRow[SERVICES[activeTab].dateField])}
                  </div>
                </div>
              )}
            </div>

            {/* Files / images */}
            {SERVICES[activeTab].fileFields.length > 0 && (
              <>
                <h4 className="font-semibold mb-2">الملفات / الصور</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES[activeTab].fileFields.map(([label, key]) => {
                    const url = selectedRow[key];
                    return (
                      <div
                        key={key}
                        className="border rounded-lg p-3 flex flex-col items-center"
                      >
                        <div className="text-sm font-medium mb-2">{label}</div>
                        {url ? (
                          <>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="فتح في تبويب جديد"
                              className="w-full"
                            >
                              <img
                                src={url}
                                alt={label}
                                className="w-full h-44 object-cover rounded mb-2 border"
                              />
                            </a>
                            <div className="flex gap-2 mt-2">
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                              >
                                فتح
                              </a>
                              {/* <a
                                href={url}
                                download
                                className="px-3 py-1 bg-gray-200 rounded text-xs"
                              >
                                تنزيل
                              </a> */}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-gray-500">
                            لا يوجد ملف
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- مساعدة للعرض ---------- */

function fieldLabel(f) {
  // خرائط بسيطة لعرض تسميات مريحة للمستخدم
  const map = {
    display_name: "الاسم",
    full_name: "الاسم",
    phone: "الموبايل",
    phone_number: "الموبايل",
    email: "البريد الإلكتروني",
    contract_type: "نوع العقد",
    created_at: "تاريخ الإنشاء",
    date_from: "من",
    date_to: "إلى",
    country: "الدولة",
  };

  return map[f] || f.replaceAll("_", " ");
}

function displayCellValue(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toLocaleString("ar-EG");
  return String(v);
}

function formatDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return (
      dt.toLocaleDateString("ar-EG") + " " + dt.toLocaleTimeString("ar-EG")
    );
  } catch {
    return String(d);
  }
}
