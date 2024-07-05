"use client";
import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBagIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { IOrderItem, OrderStatus } from "@/types/order.type";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface OrderCardProps {
  orderItems: IOrderItem[];
  orderId: string;
  purchaseTotal: number;
  orderStatus: string;
  purchaseDate: Date;
  orderNumber: string;
  url: string | undefined;
}

const OrderCard: FC<OrderCardProps> = ({
  orderStatus,
  orderId,
  purchaseTotal,
  purchaseDate,
  orderItems,
  orderNumber,
  url,
}) => {
  const router = useRouter();
  return (
    <Card
      className={`flex min-h-40 flex-col place-content-center justify-start rounded-xl p-4 shadow-[0px_1px_4px_0px_#D6DFEB] transition-all duration-75 hover:scale-[99%]`}
      onClick={() => router.push(`/order/order-details/${orderId}`)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon />
            <p className="text-sm font-medium">Belanja</p>
          </div>
          <OrderStatusBadge orderStatus={orderStatus} />
        </CardTitle>
        <CardDescription className="flex justify-between text-xs items-center">
          <div>{format(purchaseDate, "dd MMMM yyyy")}</div>
          <div className="mr-1">{orderNumber}</div>
        </CardDescription>
      </CardHeader>
      <Separator className="mt-4 h-[1px]" />
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
                  <p className="text-xs">{item.qty} pcs</p>
                </div>
              </div>
            );
          })}

          <div className="mt-2 space-y-2 text-xs">
            <p>Total Belanja:</p>
            <p className="font-semibold">
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

export default OrderCard;
