import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div className="container mt-16 flex h-fit flex-col gap-4 md:gap-10 py-10 md:flex-row">
      <Skeleton className="h-[280px] w-full rounded-xl md:h-[600px]" />
      <div className="flex w-full flex-col gap-4">
        <Skeleton className="h-[20px] w-[100px] rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[32px] w-[200px] rounded-xl" />
        <div className="flex w-full gap-2">
          <Skeleton className="h-[20px] w-[80px] rounded-xl" />
          <Skeleton className="h-[20px] w-[80px] rounded-xl" />
        </div>
        <Skeleton className="h-[24px] w-[200px] rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[20px] w-full rounded-xl" />
        <Skeleton className="h-[20px] w-4/5 rounded-xl" />
        <Skeleton className="h-[100px] w-full rounded-xl" />
        <Skeleton className="h-[60px] mt-3 w-full rounded-xl" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
