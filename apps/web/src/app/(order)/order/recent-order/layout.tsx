"use client"
import { FC, ReactNode } from "react";
import RecentOrderHeader from "../components/RecentOrderHeader";

interface OrderLayoutProps {
  children: ReactNode;
}

const RecentOrders: FC<OrderLayoutProps> = ({ children }) => {
  return (
    <div>
        <RecentOrderHeader />
        {children}
    </div>
  );
};

export default RecentOrders;
