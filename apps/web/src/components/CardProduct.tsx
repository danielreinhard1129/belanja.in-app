import { FC } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "./ui/badge";

interface CardProductProps {
  productId: number;
  name: string;
  price: number;
  images: string;
  discount: number;
}

const CardProduct: FC<CardProductProps> = ({
  name,
  discount,
  images,
  price,
  productId,
}) => {
  return (
    <Link href={`/${productId}`}>
      <Card className="hover:bg-neutral-100">
        <CardHeader className="w-full p-4">
          <div className="relative mx-auto h-[156px] w-full overflow-hidden rounded-md md:h-[250px]">
            <Image
              src={images}
              alt="name"
              fill
              className="mx-auto object-contain transition-all"
            />
            {discount === 0 ? (
              <div className="hidden"></div>
            ) : (
              <Badge
                variant="secondary"
                className="absolute left-0 top-0 w-fit text-xs md:text-base"
              >
                -{discount * 100}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <h1 className="line-clamp-2 text-sm font-medium">{name}</h1>
          <div className="flex flex-col gap-0 md:flex-row md:gap-4">
            <p className="text-base font-semibold text-[#FF6100]">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(price - price * discount),
                ).toFixed().length,
              }).format(price - price * discount)}
            </p>
            {discount === 0 ? (
              <p className="text-base font-semibold text-black/50 line-through opacity-0">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(price),
                  ).toFixed().length,
                }).format(price)}
              </p>
            ) : (
              <p className="text-base font-semibold text-black/50 line-through">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(price),
                  ).toFixed().length,
                }).format(price)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardProduct;
