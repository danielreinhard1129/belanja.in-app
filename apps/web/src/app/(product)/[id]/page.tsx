"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { appConfig } from "@/utils/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductSkeleton from "./components/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import { useAppSelector } from "@/redux/hooks";
import AddToCartButton from "./components/AddToCartButton";
import useAddToCart from "@/hooks/api/cart/useAddToCart";
import { Card, CardContent } from "@/components/ui/card";
import defaultStore from "../../../../public/default.png";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const { id: userId } = useAppSelector((state) => state.user);
  const { carts, refetch: refetchCart } = useGetCartsById(userId);
  const { addToCart } = useAddToCart();
  const { product, isLoading } = useGetProduct(Number(params.id));
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = async () => {
    await addToCart(product?.id, 1);
    refetchCart();
  };
  console.log(carts);

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
            .map((storeProduct) => (
              <p className="text-sm text-black/60">Stock: {storeProduct.qty}</p>
            ))}
          <p className="text-sm text-black/60">Weight: {product?.weight}gr</p>
        </div>
        <p className="line-clamp-2 text-sm text-black/60">
          {product?.description}
        </p>
        {product?.storeProduct
          .filter((storeProduct) => storeProduct.productId === product.id)
          .map((storeProduct) => (
            <Card className="rounded-lg">
              <CardContent className="space-y-4 p-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10">
                    <Image src={defaultStore} alt="store" />
                  </div>
                  <p className="text-sm font-medium">
                    {storeProduct.store.name}
                  </p>
                </div>
                <Separator />
                <div className="flex items-start gap-2 text-neutral-500">
                  <MapPin size={16} className="mt-[2px]" />
                  <div>
                    <p className="text-sm">Store Location</p>
                    <p className="text-sm font-medium">{storeProduct.store.City.citName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        <div className="pb-20 md:pb-10"></div>
        <div className="hidden md:flex">
          <AddToCartButton
            carts={carts}
            handleAddToCart={handleAddToCart}
            productId={product?.id}
          />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 flex h-20 w-full items-center justify-between self-center rounded-none border-t bg-white px-3 md:hidden">
        <AddToCartButton
          carts={carts}
          handleAddToCart={handleAddToCart}
          productId={product?.id}
        />
      </div>
    </div>
  );
};

export default ProductPage;
