"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import useAddToCart from "@/hooks/api/cart/useAddToCart";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import defaultStore from "../../../../public/default.png";
import AddToCartButton from "./components/AddToCartButton";
import DiscountCard from "./components/DiscountCard";
import ProductSkeleton from "./components/ProductSkeleton";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { id: userId } = useAppSelector((state) => state.user);
  const { carts, refetch: refetchCart } = useGetCartsById(userId);
  const { addToCart } = useAddToCart();
  const router = useRouter();

  const storedLocation = localStorage.getItem("location");

  const {
    storeProduct,
    isLoading,
    refetch: refetchProduct,
  } = useGetProduct({
    lat: Number(latitude),
    long: Number(longitude),
    productId: Number(params.id),
  });

  useEffect(() => {
    if (storedLocation) {
      const { lat, long } = JSON.parse(storedLocation);
      setLatitude(lat);
      setLongitude(long);
    }
  }, [storedLocation]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      refetchProduct();
    }
  }, [latitude, longitude]);

  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleAddToCart = async () => {
    if (userId !== 0) {
      await addToCart(storeProduct?.productId, storeProduct?.storeId);
      refetchCart();
    } else {
      router.push("/login");
    }
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!storeProduct && !isLoading && !storedLocation) {
    return notFound();
  }

  const stock = storeProduct?.qty || 0;

  return (
    <div className="container flex h-screen flex-col px-0 pt-20 md:flex-row md:pt-28">
      <div className="relative h-fit w-full px-4 md:w-1/2">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {storeProduct?.product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="">
                  <Card className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
                    <CardContent className="p-0">
                      <div
                        key={index}
                        className="relative aspect-square w-full overflow-hidden"
                      >
                        <Image
                          src={`${appConfig.baseUrl}/assets${image.images}`}
                          alt={`product-${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-0 left-0 right-0 mx-auto flex w-fit py-1.5">
          {Array.from({ length: count }).map((_, index) => (
            <span
              key={index}
              className={`mx-[2px] h-1 w-10 rounded-full ${
                current === index + 1 ? "bg-[#FF6100]" : "bg-[#CDCDCD]"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <div className="w-full space-y-2 px-4 pt-4 md:w-1/2 md:px-0 md:pl-20 md:pt-0">
        {storeProduct?.product.categories
          .filter((category) => category.productId === storeProduct.productId)
          .map((category) => (
            <Badge
              key={category.categoryId}
              className="rounded-lg bg-[#97e6a8] text-xs font-normal text-[#19792e] hover:bg-[#97e6a8] hover:text-[#19792e]"
            >
              {category.category.name}
            </Badge>
          ))}
        <h1 className="line-clamp-2 w-full pt-2 text-lg font-medium">
          {storeProduct?.product.name}
        </h1>
        <p className="text-2xl font-semibold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: Math.trunc(
              Math.abs(Number(storeProduct?.product.price)),
            ).toFixed().length,
          }).format(Number(storeProduct?.product.price))}
        </p>
        <div className="flex gap-3">
          <p className="text-sm text-black/60">Stock: {storeProduct?.qty}</p>
          <p className="text-sm text-black/60">
            Weight: {storeProduct?.product.weight}gr
          </p>
        </div>
        <Separator />
        <h2 className="text-base font-medium">Description</h2>
        <p className="text-sm text-black/60">
          {storeProduct?.product.description}
        </p>
        {storeProduct?.product.discounts
          .filter((discount) => discount.productId === storeProduct.productId)
          .map((discount, index) => (
            <DiscountCard
              key={index}
              discountLimit={discount.discountLimit}
              discountType={discount.discountType}
              discountValue={discount.discountvalue}
              index={index}
              minPurchase={discount.minPurchase}
              title={discount.title}
            />
          ))}
        <Card className="rounded-lg">
          <CardContent className="space-y-4 p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10">
                <Image src={defaultStore} alt="store" />
              </div>
              <p className="text-sm font-medium">{storeProduct?.store.name}</p>
            </div>
            <Separator />
            <div className="flex items-start gap-2 text-neutral-500">
              <MapPin size={16} className="mt-[2px]" />
              <p className="text-sm">Store Location:</p>
              <p className="text-sm font-medium">
                {storeProduct?.store.City.citName}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="pb-20 md:pb-10"></div>
        <div className="hidden md:flex">
          <AddToCartButton
            carts={carts}
            handleAddToCart={handleAddToCart}
            productId={Number(params.id)}
            stock={stock}
          />
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 flex h-20 w-full items-center justify-between self-center rounded-none border-t bg-white px-3 md:hidden">
        <AddToCartButton
          carts={carts}
          handleAddToCart={handleAddToCart}
          productId={Number(params.id)}
          stock={stock}
        />
      </div>
    </div>
  );
};

export default ProductPage;
