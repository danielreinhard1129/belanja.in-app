"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useGetMostBuyProducts from "@/hooks/api/report/useGetMostBuyProducts";
import { appConfig } from "@/utils/config";
import { formatToRupiah } from "@/utils/formatCurrency";
import { Crown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CardRanking = () => {
  const [storeId, setStoreId] = useState<string>("");
  const { data, isLoading } = useGetMostBuyProducts({ storeId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="relative h-fit w-full md:w-[600px] rounded-xl">
      <CardContent className="relative z-20">
        <div className="flex flex-col gap-3 rounded-3xl p-6">
          <div className="flex mb-4 items-center justify-between">
            <h1 className="text-lg font-semibold">
              Most Ordered Products
            </h1>
            <p className="text-sm text-end text-gray-600 font-medium">Order Count</p>
          </div>
          {data?.data.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="mb-4 flex items-center justify-evenly gap-4"
            >
              <div className="relative h-12 w-24 overflow-hidden rounded-lg">
                <Image
                  key={product.images[0].id}
                  src={`${appConfig.baseUrl}/assets${product.images[0].images}`}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-full">
                <h2 className="text-lg line-clamp-1 font-medium text-black">
                  {product.name}
                </h2>
                <p className="text-sm font-medium text-gray-600">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: Math.trunc(
                      Math.abs(Number(product?.price)),
                    ).toFixed().length,
                  }).format(Number(product?.price))}
                </p>
              </div>
              <div className="w-full text-end">
                <p className="text-black">{product.orderCount}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Crown
        className="absolute -bottom-10 -right-10 z-0 -rotate-12 text-[#ffdfcb]"
        size={200}
      />
    </Card>
  );
};

export default CardRanking;
