"use client";
import AuthGuardAdmin from "@/hoc/AuthGuardAdmin";
import { FC, ReactNode } from "react";
import Navbar from "./components/Navbar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col bg-gray-100 md:flex-row">
      <Navbar />
      {children}
    </div>
  );
};

export default AuthGuardAdmin(AdminLayout);
