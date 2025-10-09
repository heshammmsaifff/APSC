"use client";
import { useLang } from "../context/LangContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "./nav";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const { user } = useAuth();

  return (
    <>
      <Navbar user={user} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
