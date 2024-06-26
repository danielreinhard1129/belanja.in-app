import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="absolute left-0 right-0 z-50 h-screen w-full bg-white">
      <Header />
      <Card className="border-none shadow-none">{children}</Card>
      <Footer />
    </div>
  );
};

export default AuthLayout;
