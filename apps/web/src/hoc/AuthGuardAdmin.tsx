"use client";

import { useAppSelector } from "@/redux/hooks";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function AuthGuardAdmin(Component: any) {
  return function IsAuth(props: any) {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const { id, role } = useAppSelector((state) => state.user);

    useEffect(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }, []);

    useEffect(() => {
      if (!isLoading) {
        if (!id) {
          redirect("/login");
        } else if (role === "USER") {
          toast({
            description: "You don't have access to this link",
          });
          redirect("/");
        }
      }
    }, [id, role, isLoading, toast]);

    if (isLoading || !id) {
      return (
        <h1 className="container flex h-screen justify-center px-4 pt-24 text-4xl font-extrabold">
          Loading...
        </h1>
      );
    }

    return <Component {...props} />;
  };
}
