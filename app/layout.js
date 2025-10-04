import "./globals.css";
import { LangProvider } from "./context/LangContext";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "APSC Travel",
  description: "Travel website",
};

export default function RootLayout({ children }) {
  return (
    <LangProvider>
      <ClientLayout>{children}</ClientLayout>
    </LangProvider>
  );
}
