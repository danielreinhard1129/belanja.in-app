import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const SkeletonOrderCard = () => {
  const skeletonArr = [0, 1, 2];

  return (
    <div className="flex flex-col gap-y-2">
      {skeletonArr.map((item, index) => {
        return ( <Card
            className={`flex min-h-40 flex-col place-content-center justify-start rounded-xl p-4 shadow-[0px_1px_4px_0px_#D6DFEB] transition-all duration-75`}
            key={index}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </CardTitle>
              <CardDescription className="text-xs">
                <Skeleton className="h-4 max-w-24" />
              </CardDescription>
            </CardHeader>
            <Separator className="mt-4 h-[1px]" />
            <CardContent className="px-0 py-2">
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-12 w-12 overflow-hidden rounded-full object-cover" />
                  <div className="space-y-1 text-sm">
                    <Skeleton className="h-4 w-32 text-sm font-medium" />
                    <Skeleton className="h-4 w-20 text-sm font-medium" />
                  </div>
                </div>
    
                <div className="mt-2 space-y-2 text-xs">
                  <Skeleton className="h-4 max-w-20 text-sm font-medium" />
                  <Skeleton className="h-4 max-w-28 text-sm font-medium" />
                </div>
              </div>
            </CardContent>
          </Card>);
      })}
     
    </div>
  );
};

export default SkeletonOrderCard;
