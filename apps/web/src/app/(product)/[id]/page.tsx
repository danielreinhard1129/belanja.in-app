"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { appConfig } from "@/utils/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductSkeleton from "./components/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const { product, isLoading } = useGetProduct(Number(params.id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product && !isLoading) {
    return notFound();
  }

  return (
    <div className="container flex h-screen flex-col px-0 pt-20 md:flex-row md:pt-28">
      <div className="relative w-full md:w-1/2">
        <div className="relative aspect-square overflow-hidden rounded-none md:rounded-3xl">
          {product ? (
            <Image
              src={`${appConfig.baseUrl}/assets${product?.images[selectedImage].images}`}
              alt={`product-${selectedImage}`}
              fill
              className="object-cover"
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </div>
        <div className="absolute right-3 top-3 grid h-20 w-20 grid-rows-4 gap-2 opacity-50 transition-opacity duration-500 hover:opacity-100 md:right-10 md:top-10 md:h-28 md:w-28 md:px-0">
          {product?.images.map((image, index) => (
            <div
              key={index}
              className="relative col-span-1 aspect-square cursor-pointer overflow-hidden rounded-lg"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={`${appConfig.baseUrl}/assets${image.images}`}
                alt={`product-${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full space-y-2 px-4 pt-4 md:w-1/2 md:px-0 md:pl-20 md:pt-0">
        <Badge>{product?.categories[0].category.name}</Badge>
        <h1 className="line-clamp-2 w-full text-2xl font-medium">
          {product?.name}
        </h1>
        <p className="line-clamp-2 text-sm text-black/60">
          {product?.description}
        </p>
        <p>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: Math.trunc(
              Math.abs(Number(product?.price)),
            ).toFixed().length,
          }).format(Number(product?.price))}
        </p>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
        <div>CIHUY</div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 flex h-20 w-full items-center justify-between self-center rounded-none border-t bg-white px-3 md:hidden">
        <div className="flex w-full gap-4 pl-4">
          <p>-</p>
          <p>1</p>
          <p>+</p>
        </div>
        <Button className="w-full py-3">Add to Cart</Button>
      </div>
    </div>
  );
};

export default ProductPage;
