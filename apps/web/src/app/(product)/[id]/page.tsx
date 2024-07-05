"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { appConfig } from "@/utils/config";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import ProductSkeleton from "./components/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import { useAppSelector } from "@/redux/hooks";
import AddToCartButton from "./components/AddToCartButton";
import useAddToCart from "@/hooks/api/cart/useAddToCart";
import { Card, CardContent } from "@/components/ui/card";
import defaultStore from "../../../../public/default.png";
import { Separator } from "@/components/ui/separator";
import { MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const { id: userId } = useAppSelector((state) => state.user);
  const { carts, refetch: refetchCart } = useGetCartsById(userId);
  const { addToCart } = useAddToCart();
  const { product, isLoading } = useGetProduct(Number(params.id));
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();

  const handleAddToCart = async () => {
    await addToCart(product?.id, 1);
    refetchCart();
  };
  const handleNonRegistered = () => {
    router.push("/login");
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product && !isLoading) {
    return notFound();
  }

  return (
    <div className="container flex h-screen flex-col px-0 pt-20 md:flex-row md:pt-28">
      <div className="relative flex w-full flex-col gap-4 md:w-3/5 md:flex-row">
        <div className="relative aspect-square w-[100vw] overflow-hidden rounded-none md:h-[700px] md:w-[700px] md:rounded-3xl">
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
        <div className="flex w-fit flex-row gap-4 self-center md:w-40 md:flex-col md:self-start md:px-0">
          {product?.images.map((image, index) => (
            <div
              key={index}
              className="aspect-square w-20 cursor-pointer overflow-hidden rounded-lg opacity-50 transition-opacity duration-500 hover:opacity-100 md:rounded-3xl"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={`${appConfig.baseUrl}/assets${image.images}`}
                alt={`product-${index + 1}`}
                height={1000}
                width={1000}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-full space-y-3 px-4 pt-4 md:w-1/2 md:px-0 md:pl-20 md:pt-0">
        {product?.categories
          .filter((category) => category.productId === product.id)
          .map((category, index) => (
            <Badge key={index} className="bg-[#FF6100] text-xs font-normal">
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
        <p className="line-clamp-5 text-sm text-black/60">
          {product?.description}
        </p>
        {product?.storeProduct
          .filter((storeProduct) => storeProduct.productId === product.id)
          .map((storeProduct, index) => (
            <Card key={index} className="rounded-lg">
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
                    <p key={index} className="text-sm font-medium">
                      {storeProduct.store.City.citName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        <div className="pb-20 md:pb-10"></div>
        <div className="hidden md:flex">
          {userId !== 0 ? (
            <AddToCartButton
              carts={carts}
              handleAddToCart={handleAddToCart}
              productId={product?.id}
            />
          ) : (
            <Button
              onClick={handleNonRegistered}
              className="flex w-full gap-3 bg-[#FF6100] px-2 py-3 text-white"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 flex h-20 w-full items-center justify-between self-center rounded-none border-t bg-white px-3 md:hidden">
        {userId !== 0 ? (
          <AddToCartButton
            carts={carts}
            handleAddToCart={handleAddToCart}
            productId={product?.id}
          />
        ) : (
          <Button
            onClick={handleNonRegistered}
            className="flex w-full gap-3 bg-[#FF6100] px-2 py-3 text-white"
          >
            <ShoppingBag size={20} />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
