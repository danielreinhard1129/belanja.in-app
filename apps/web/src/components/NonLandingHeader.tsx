"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

const NonLandingHeader: FC<{ label: string }> = ({ label }) => {
  const router = useRouter();
  return (
    <div className="flex h-16 items-center justify-start gap-4 border-b-4 bg-gradient-to-b from-white from-70% to-gray-50 px-4">
      <div
        className="flex h-12 w-12 cursor-pointer items-center justify-center hover:bg-gray-100"
        onClick={() => router.back()}
      >
        <ArrowLeft />
      </div>
      <div className="text-lg font-semibold">{label}</div>
    </div>
  );
};

export default NonLandingHeader;
