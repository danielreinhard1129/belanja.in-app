import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="absolute left-0 right-0 z-50 h-screen w-full flex-col bg-white">
      {children}
    </div>
  );
};

export default AuthLayout;
