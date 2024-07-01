import NonLandingHeader from "@/components/NonLandingHeader";
import { FC, ReactNode } from "react";

interface OrderLayoutProps {
  children: ReactNode;
}

const CartLayout: FC<OrderLayoutProps> = ({ children }) => {
  return <div><NonLandingHeader label="Cart"/>{children}</div>;
};

export default CartLayout;
