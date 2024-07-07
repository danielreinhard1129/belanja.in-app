import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Discount } from "@/types/discount.type";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BadgePercent } from "lucide-react";

interface OrderSummarySheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  price: number;
  deliveryFee: number | undefined;
  discount: Discount | undefined;
}

const OrderSummarySheet: FC<OrderSummarySheetProps> = ({
  openState,
  deliveryFee,
  price,
  discount,
  setOpenState,
}) => {
  let total = 0;
  if (deliveryFee) {
    total = price + deliveryFee;
  }
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent
        side={"bottom"}
        className="flex h-fit flex-col gap-4 overflow-y-scroll rounded-t-lg"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-start">Order Summary</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="flex w-full justify-between items-center">
            <p className="text-sm font-medium text-gray-600">Price</p>
            <p className="font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(Number(price)),
                ).toFixed().length,
              }).format(Number(price))}
            </p>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-sm font-medium text-gray-600">Delivery fee</p>
            <p className="font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(Number(deliveryFee)),
                ).toFixed().length,
              }).format(Number(deliveryFee))}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Discount:</p>
            {discount && (
              <Card
                className={`cursor-pointer rounded-lg bg-gradient-to-r from-red-200 to-orange-200 text-white`}
              >
                <CardContent className="flex w-full flex-row gap-4 px-4 py-4">
                  <div className="flex items-center gap-2">
                    <BadgePercent fill="gray" className="text-white" />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <p className="text-sm font-medium text-gray-600">
                      {discount.discountType == "BOGO"
                        ? `Get buy one get one discount on ${discount.product.name}`
                        : discount.discountType == "PRODUCT"
                          ? `Get ` +
                            discount.discountvalue +
                            `% discount on ${discount.product.name}`
                          : `Get ` + discount.discountvalue + `% discount`}
                      {discount.discountType == "MIN_PURCHASE"
                        ? `With minimal purchase ` + discount.minPurchase
                        : null}{" "}
                      <span>
                        {discount.discountType == "MIN_PURCHASE"
                          ? `up to ` + discount.discountLimit
                          : null}{" "}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600">
                      With min. purchase{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumSignificantDigits: Math.trunc(
                          Math.abs(Number(discount.minPurchase)),
                        ).toFixed().length,
                      }).format(Number(discount.minPurchase))}{" "}
                      up to{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumSignificantDigits: Math.trunc(
                          Math.abs(Number(discount.discountLimit)),
                        ).toFixed().length,
                      }).format(Number(discount.discountLimit))}{" "}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-700">Total</p>
            {!deliveryFee ? (
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(price)),
                  ).toFixed().length,
                }).format(Number(price))}
              </p>
            ) : (
              <p className="text-lg font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(total)),
                  ).toFixed().length,
                }).format(Number(total))}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSummarySheet;
