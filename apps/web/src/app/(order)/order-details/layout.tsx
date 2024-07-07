"use client"

import { FC, ReactNode } from "react";
import NonLandingHeader from "@/components/NonLandingHeader";
import AuthGuardTrx from "@/hoc/AuthGuardTrx";

const RecentOrders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <NonLandingHeader label="Order Details" />
      {children}
    </div>
  );
};

export default AuthGuardTrx(RecentOrders);
