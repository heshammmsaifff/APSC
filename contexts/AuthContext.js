"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل الجلسة الحالية
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error("❌ Error loading session:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // ✅ متابعة تغيّر حالة المستخدم (تسجيل دخول / خروج / تحديث)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("🔄 Auth changed:", _event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ✅ إنشاء حساب جديد مع metadata (الاسم والموبايل)
  const signUp = async (email, password, name, phone) => {
    try {
      const cleanName = String(name || "").trim();
      const cleanPhone = String(phone || "").trim();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          },
        },
      });

      if (error) throw error;

      console.log("✅ User created:", data.user);
      return { data, error: null };
    } catch (error) {
      console.error("❌ SignUp error:", error);
      return { data: null, error };
    }
  };

  // ✅ تسجيل الدخول
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ SignIn error:", error);
      return { data: null, error };
    }
  };

  // ✅ تسجيل الخروج
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("👋 Signed out successfully");
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  // ✅ إعادة تعيين كلمة المرور
  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("❌ Reset password error:", error);
      return { data: null, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
