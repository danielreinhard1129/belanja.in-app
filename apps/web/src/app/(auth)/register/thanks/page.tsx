"use client";

import Image from "next/image";
import thanks from "../../../../../public/success.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const Thanks = () => {
  const router = useRouter();
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center px-0">
      <Card className="flex flex-col items-center space-y-2 rounded-xl p-4">
        <CardHeader>
          <div className="flex flex-col">
            <Image src={thanks} alt="thanks" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col items-center gap-8">
            <h1 className="text-xl font-medium">Thanks</h1>
            <p className="text-sm text-gray-500">
              Please check your email to verify.
            </p>
            <Button
              className="w-full py-2"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="link"
              className="w-full py-2"
              onClick={() => router.push("/")}
            >
              Back to home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Thanks;
