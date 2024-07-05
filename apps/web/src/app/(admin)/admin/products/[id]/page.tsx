"use client";
import { Badge } from "@/components/ui/badge";
import { appConfig } from "@/utils/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import React, { useState } from "react";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import ProductSkeleton from "@/app/(product)/[id]/components/ProductSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const { product, isLoading } = useGetProduct(Number(params.id));
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product && !isLoading) {
    return notFound();
  }
  return (
    <main className="container mr-40 flex h-screen max-w-5xl flex-col px-0 pt-20 md:flex-row md:pt-28">
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
        <div className="absolute right-3 top-3 grid h-80 w-20 grid-rows-4 gap-2 opacity-50 transition-opacity duration-500 hover:opacity-100 md:right-10 md:top-10 md:h-28 md:w-28 md:px-0">
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
      <div className="w-full space-y-3 px-4 pt-4 md:w-1/2 md:px-0 md:pl-20 md:pt-0">
        {product?.categories
          .filter((category) => category.productId === product.id)
          .map((category) => (
            <Badge
              key={category.categoryId}
              className="bg-[#FF6100] text-xs font-normal"
            >
              {category.category.name}
            </Badge>
          ))}
        <h1 className="line-clamp-2 w-full text-2xl font-medium">
          {product?.name}
        </h1>
        <p className="text-3xl font-semibold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: Math.trunc(
              Math.abs(Number(product?.price)),
            ).toFixed().length,
          }).format(Number(product?.price))}
        </p>
        <div className="flex gap-3">
          {product?.storeProduct
            .filter((storeProduct) => storeProduct.productId === product.id)
            .map((storeProduct, index) => (
              <p key={index} className="text-sm text-black/60">
                Stock: {storeProduct.qty}
              </p>
            ))}
          <p className="text-sm text-black/60">Weight: {product?.weight}gr</p>
        </div>
        <p className="line-clamp-2 text-sm text-black/60">
          {product?.description}
        </p>
        <div className="pb-20 md:pb-10"></div>
      </div>
    </main>
  );
};

export default ProductDetail;
