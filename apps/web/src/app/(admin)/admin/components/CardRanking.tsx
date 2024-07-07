"use client";

import { Card, CardContent } from "@/components/ui/card";
import useGetMostBuyProducts from "@/hooks/api/report/useGetMostBuyProducts";
import useGetStoreByStoreAdmin from "@/hooks/api/store/useGetStoreByStoreAdmin";
import { useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { Crown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const CardRanking = () => {
  const { id, role } = useAppSelector((state) => state.user);
  const { store } = useGetStoreByStoreAdmin(id);
  const [storeId, setStoreId] = useState<string>("");
  const { data, isLoading } = useGetMostBuyProducts({ storeId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {role !== "STOREADMIN" ? (
        <div className="hidden"></div>
      ) : (
        <Card className="relative h-fit w-full rounded-xl md:w-[600px]">
          <CardContent className="relative z-20">
            <div className="flex flex-col gap-3 rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Most Ordered Products</h1>
                <p className="text-end text-sm font-medium text-gray-600">
                  Order Count
                </p>
              </div>
              {data ? (
                <div>
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
                        <h2 className="line-clamp-1 text-lg font-medium text-black">
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
              ) : (
                <div>No data found!</div>
              )}
            </div>
          </CardContent>
          <Crown
            className="absolute -bottom-10 -right-10 z-0 -rotate-12 text-[#ffdfcb]"
            size={200}
          />
        </Card>
      )}
    </>
  );
};

export default CardRanking;
