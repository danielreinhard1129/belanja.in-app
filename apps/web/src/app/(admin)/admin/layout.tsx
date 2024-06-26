"use client";
import { FC, ReactNode } from "react";
import AuthGuardAdmin from "@/hoc/AuthGuardAdmin";
import Navbar from "./components/Navbar";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <Navbar />
      {children}
    </div>
  );
};

export default AuthGuardAdmin(AdminLayout);
