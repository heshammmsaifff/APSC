import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { LangProvider } from "./context/LangContext";
import LayoutWrapper from "./components/LayoutWrapper";

export const metadata = {
  title: "APSC",
  description: "Travel easy",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LangProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
      </LangProvider>
    </AuthProvider>
  );
}
