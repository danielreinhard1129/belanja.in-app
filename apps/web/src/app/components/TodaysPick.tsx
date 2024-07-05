"use client";

import CardProduct from "@/components/CardProduct";
import { useState } from "react";
import useGetProductsByLocation from "@/hooks/api/product/useGetProductsByLocation";
import { appConfig } from "@/utils/config";
import Pagination from "@/components/Pagination";

const TodaysPick = () => {
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const {
    data,
    isLoading: productsLoading,
    meta,
    refetch,
  } = useGetProductsByLocation({ page, take: 8 });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  
  return (
    <div className="container flex flex-col gap-4 p-0 px-4">
      <div className="flex items-center gap-2">
        <svg className="h-[24px] w-[12px]">
          <rect className="h-full w-full" fill="#FF6100" />
        </svg>
        <p className="text-base font-medium">Today&apos;s Pick</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {data.map((storeProduct, index) => (
          <CardProduct
            key={index}
            images={`${appConfig.baseUrl}/assets${storeProduct.product.images[0].images}`}
            discount={0}
            name={storeProduct.product.name}
            price={storeProduct.product.price}
            productId={storeProduct.product.id}
          />
        ))}
      </div>
      <div className="mx-auto w-fit">
            <Pagination
              total={meta?.total || 0}
              take={meta?.take || 0}
              onChangePage={handleChangePaginate}
            />
          </div>
    </div>
  );
};

export default TodaysPick;
