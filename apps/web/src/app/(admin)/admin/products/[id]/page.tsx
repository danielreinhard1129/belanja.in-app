"use client";
import ProductSkeleton from "@/app/(product)/[id]/components/ProductSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { appConfig } from "@/utils/config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const { product, isLoading } = useGetProduct(Number(params.id));
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

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (!product && !isLoading) {
    return notFound();
  }

  return (
    <main className="container flex h-screen flex-col px-48 py-40 md:flex-row md:pt-20">
      <div className="relative h-fit w-full px-4 md:w-1/2">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {product?.images.map((image, index) => (
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
        {product?.categories
          .filter((category) => category.productId === product?.id)
          .map((category) => (
            <Badge
              key={category.categoryId}
              className="rounded-lg bg-[#97e6a8] text-xs font-normal text-[#19792e] hover:bg-[#97e6a8] hover:text-[#19792e]"
            >
              {category.category.name}
            </Badge>
          ))}
        <h1 className="line-clamp-2 w-full pt-2 text-lg font-medium">
          {product?.name}
        </h1>
        <p className="text-2xl font-semibold">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumSignificantDigits: Math.trunc(
              Math.abs(Number(product?.price)),
            ).toFixed().length,
          }).format(Number(product?.price))}
        </p>
        <div className="flex gap-3">
          <p className="text-sm text-black/60">Weight: {product?.weight}gr</p>
        </div>
        <Separator />
        <h2 className="text-base font-medium">Description</h2>
        <p className="text-sm text-black/60">{product?.description}</p>
      </div>
    </main>
  );
};

export default ProductDetail;
