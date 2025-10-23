import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { LangProvider } from "./context/LangContext";
import LayoutWrapper from "./components/LayoutWrapper";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AGPS",
  description: "Travel easy",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LangProvider>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "15px",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#333",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#333",
              },
            },
          }}
        />
      </LangProvider>
    </AuthProvider>
  );
}
