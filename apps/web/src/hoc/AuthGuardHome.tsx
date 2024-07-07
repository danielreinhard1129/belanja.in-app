"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuardHome(Component: any) {
  return function IsAuth(props: any) {
    const [isLoading, setIsLoading] = useState(true);

    const { role } = useAppSelector((state: any) => state.user);

    useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);

    useEffect(() => {
      if (
        (role === "SUPERADMIN" && !isLoading) ||
        (role === "STOREADMIN" && !isLoading)
      ) {
        redirect("/admin");
      }
    }, [role, isLoading]);

    if (isLoading) {
      return (
        <div className="container mt-12 flex h-screen flex-col gap-4 py-10">
          <Skeleton className="h-1/5 w-full rounded-xl md:h-[400px]" />
          <Skeleton className="h-[20px] w-[140px] rounded-xl" />
          <div className="flex w-full gap-2">
            <Skeleton className="h-[20px] w-full rounded-xl" />
            <Skeleton className="h-[20px] w-[140px] rounded-xl" />
          </div>
          <div className="flex w-full gap-4">
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-[220px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
              <Skeleton className="h-[20px] w-1/2 rounded-xl" />
            </div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
