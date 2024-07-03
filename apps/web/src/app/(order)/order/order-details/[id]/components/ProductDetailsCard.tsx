import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IOrderItem } from "@/types/order.type";
import Image from "next/image";
import { FC } from "react";

interface OrderCardProps {
  orderItems: IOrderItem[];
  orderId: number;
  purchaseTotal: number;
  url: string | undefined;
}

const ProductDetailsCard: FC<OrderCardProps> = ({
  url,
  orderItems,
  purchaseTotal,
}) => {
  return (
    <Card
      className={`flex min-h-40 flex-col place-content-center justify-start rounded-xl p-4 shadow-[0px_2px_4px_0px_#D6DFEB] transition-all duration-75 `}
    >
   
      <CardContent className="px-0 py-2">
        <div className="flex flex-col gap-y-2">
          {orderItems.map((item, index) => {
            return (
              <div className="flex items-center gap-2" key={index}>
                <div className="relative h-12 w-12 overflow-hidden rounded-sm border">
                  <Image
                    alt="Product"
                    fill
                    src={`${url}/assets${item.products.images[0].images}`}
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{item.products.name}</p>
                  <p className="text-xs">
                    {item.qty} x{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumSignificantDigits: Math.trunc(
                        Math.abs(item.products.price),
                      ).toFixed().length,
                    }).format(item.products.price)}
                  </p>
                </div>
              </div>
            );
          })}
          <Separator className="mt-4 h-[1px]" />

          <div className="mt-2 space-y-2 text-xs">
            <p>Total Belanja:</p>
            <p className="text-sm font-semibold">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(purchaseTotal),
                ).toFixed().length,
              }).format(purchaseTotal)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetailsCard;
