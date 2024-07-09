import { FC } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "./ui/badge";
import defaultStore from "../../public/default.png";

interface CardProductProps {
  productId: number;
  name: string;
  price: number;
  images: string;
  discount: number;
  store?: string;
}

const CardProduct: FC<CardProductProps> = ({
  name,
  discount,
  images,
  price,
  productId,
  store,
}) => {
  return (
    <Link href={`/${productId}`}>
      <Card className="hover:bg-neutral-100 h-fit md:h-[360px]">
        <CardHeader className="relative w-full p-0">
          <div className="relative mx-auto aspect-square w-full overflow-hidden">
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
        <CardContent className="flex flex-col gap-2 pt-4">
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
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 opacity-80">
              <Image src={defaultStore} alt="store" />
            </div>
            <p className="text-xs line-clamp-2 font-medium text-gray-500">{store}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardProduct;
