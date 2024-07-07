import NonLandingHeader from "@/components/NonLandingHeader";
import { FC, ReactNode } from "react";
import CartFooter from "./components/CartFooter";

interface OrderLayoutProps {
  children: ReactNode;
}

const CartLayout: FC<OrderLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col justify-between">
      <NonLandingHeader label="Cart" />
      {children}
      <CartFooter />
    </div>
  );
};

export default CartLayout;
