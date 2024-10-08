"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuardSign(Component: any) {
  return function IsAuth(props: any) {
    const [isLoading, setIsLoading] = useState(true);

    const { role } = useAppSelector((state: any) => state.user);

    useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);

    useEffect(() => {
      if (role === "USER" && !isLoading) {
        redirect("/");
      } else if (
        (role === "SUPERADMIN" && !isLoading) ||
        (role === "STOREADMIN" && !isLoading)
      ) {
        redirect("/admin");
      }
    }, [role, isLoading]);

    if (isLoading) {
      return (
        <div className="container flex h-screen flex-col gap-10 py-10 md:flex-row md:items-center">
          <Skeleton className="h-1/5 w-full rounded-xl md:h-[85vh] md:w-1/2" />
          <Skeleton className="h-4/5 w-full rounded-xl md:h-[85vh] md:w-1/2" />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
