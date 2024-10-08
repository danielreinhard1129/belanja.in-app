"use client";
import NonLandingHeader from "@/components/NonLandingHeader";
import AuthGuardTrx from "@/hoc/AuthGuardTrx";
import { FC, ReactNode } from "react";

interface OrderLayoutProps {
  children: ReactNode;
}

const RecentOrders: FC<OrderLayoutProps> = ({ children }) => {
  return (
    <div>
      <NonLandingHeader label="Recent Orders" /> {children}
    </div>
  );
};

export default AuthGuardTrx(RecentOrders);
