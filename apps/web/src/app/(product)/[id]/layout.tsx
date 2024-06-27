import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="absolute left-0 right-0 z-50 h-screen w-full bg-white">
      <Header />
      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default AuthLayout;
