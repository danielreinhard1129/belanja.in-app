import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Discount } from "@/types/discount.type";
import { BadgePercent } from "lucide-react";
interface DiscountCardProps {
  data: Discount;
  closeDrawer: () => void;
}
const DiscountCard: FC<DiscountCardProps> = ({ closeDrawer, data }) => {
  return (
    <div>
      <div>
        <Card
          className={`rounded-lg ${data.isSelected ? "rounded-lg bg-gradient-to-r cursor-pointer from-red-200 to-orange-200 text-white" : ""} `}
          onClick={() => closeDrawer()}
        >
          <CardHeader>
            {/* <div className="min-h-4">
          {data.isPrimary ? (
            <Badge
              variant="outline"
              className="flex w-[56px] justify-center rounded-sm bg-zinc-300 px-0.5 py-0.5 align-middle text-xs text-zinc-600"
            >
              <p>Primary</p>
            </Badge>
          ) : null}
        </div> */}
            {/* <CardTitle>{data.title}</CardTitle>
            <CardDescription>{data.desc}</CardDescription> */}
          </CardHeader>
          <CardContent className="flex w-full flex-row gap-4 px-4 py-4">
            {/* <p>
              <p>{data.discountType} </p>
              <p>
                <p>
                  {data.discountType == "BOGO"
                    ? `Get buy one get one discount on ${data.product.name}`
                    : data.discountType == "PRODUCT"
                      ? `Get ` +
                        data.discountvalue +
                        `% discount on ${data.product.name}`
                      : `Get ` + data.discountvalue + `% discount`}
                </p>
                {data.discountType == "MIN_PURCHASE"
                  ? `With minimal purchase ` + data.minPurchase
                  : null}{" "}
                <span>
                  {data.discountType == "MIN_PURCHASE"
                    ? `up to ` + data.discountLimit
                    : null}{" "}
                </span>
              </p>
            </p> */}
            <div className="flex items-center gap-2">
              <BadgePercent fill="gray" className="text-white" />
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">
                {data.discountType == "BOGO"
                  ? `Get buy one get one discount on ${data.product.name}`
                  : data.discountType == "PRODUCT"
                    ? `Get ` +
                      data.discountvalue +
                      `% discount on ${data.product.name}`
                    : `Get ` + data.discountvalue + `% discount`}
                {data.discountType == "MIN_PURCHASE"
                  ? `With minimal purchase ` + data.minPurchase
                  : null}{" "}
                <span>
                  {data.discountType == "MIN_PURCHASE"
                    ? `up to ` + data.discountLimit
                    : null}{" "}
                </span>
              </p>
              <p className="text-xs text-gray-600">
                With min. purchase{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(data.minPurchase)),
                  ).toFixed().length,
                }).format(Number(data.minPurchase))}{" "}
                up to{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(data.discountLimit)),
                  ).toFixed().length,
                }).format(Number(data.discountLimit))}{" "}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscountCard;
