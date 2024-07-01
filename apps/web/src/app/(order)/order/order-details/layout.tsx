import { FC, ReactNode } from "react";
import NonLandingHeader from "@/components/NonLandingHeader";

const RecentOrders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <NonLandingHeader label="Order Details" />
      {children}
    </div>
  );
};

export default RecentOrders;
