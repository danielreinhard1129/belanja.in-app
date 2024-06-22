"use client";
import { FC, ReactNode } from "react";
import AuthGuardAdmin from "@/hoc/AuthGuardAdmin";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default AuthGuardAdmin(AdminLayout);
