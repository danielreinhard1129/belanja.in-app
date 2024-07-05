import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SkeletonShippingMethod = () => {
  return (
    <div className="flex flex-col gap-y-2 px-4 py-2 text-sm">
      <Skeleton className="h-4 max-w-64"/>
      <Skeleton className="h-4 mt-2 max-w-64"/>
      <Skeleton className="h-4 max-w-32"/>
    </div>
  );
};

export default SkeletonShippingMethod;
