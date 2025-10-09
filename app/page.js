"use client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./components/nav";
import Footer from "./components/Footer";
import Hero from "./components/hero";
import Booking from "./components/booking";
import BestSelling from "./components/BestSelling";
import Services from "./components/Services";
import ContactSection from "./components/ContactSection";

export default function Home() {
  const { user, loading } = useAuth();

  // أثناء التحميل فقط (يعني جلب بيانات المستخدم)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // عرض الصفحة للجميع (سواء مسجل دخول أو لا)
  return (
    <>
      <Navbar user={user} />
      <Hero />
      <Booking />
      <BestSelling />
      <Services />
      <ContactSection />
      <Footer />
    </>
  );
}
