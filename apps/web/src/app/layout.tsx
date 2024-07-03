import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/sonner";

const font = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Belanja.in",
  description: "Generated by create next app",
};

const clientId =
  process.env.GOOGLE_CLIENT_ID ||
  "839845136676-ntkgv48oeubdgvgnblaejejkfc8rs6kp.apps.googleusercontent.com";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <StoreProvider>
          <GoogleOAuthProvider clientId={clientId}>
            {children}
          </GoogleOAuthProvider>
        </StoreProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
