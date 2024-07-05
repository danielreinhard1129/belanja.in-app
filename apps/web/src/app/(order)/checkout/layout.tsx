import { FC, ReactNode } from "react";
import NonLandingHeader from "@/components/NonLandingHeader";

interface OrderLayoutProps {
  children: ReactNode;
}

const NewOrder: FC<OrderLayoutProps> = ({ children }) => {
  return <div><NonLandingHeader label="Checkout"/>{children}</div>;
};

export default NewOrder;
