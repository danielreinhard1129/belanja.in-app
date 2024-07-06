import { Header } from "@/components/Header";
import { FC, ReactNode } from "react";
import Navbar from "./components/Navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="absolute left-0 right-0 z-50 h-screen w-full bg-white">
      <div className="hidden md:flex">
        <Header />
      </div>
      <div className="flex md:hidden">
        <Navbar />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
