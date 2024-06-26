import { Card } from "@/components/ui/card";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="absolute right-0 left-0 z-50 w-screen h-screen bg-white">
      <Card className="border-none shadow-none">{children}</Card>
    </div>
  );
};

export default AuthLayout;
