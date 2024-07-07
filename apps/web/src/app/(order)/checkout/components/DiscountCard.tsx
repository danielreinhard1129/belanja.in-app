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
interface DiscountCardProps {
  data: Discount;
  closeDrawer: () => void;
}
const DiscountCard: FC<DiscountCardProps> = ({ closeDrawer, data }) => {
  return (
    <div>
      <div>
        <Card
          className={`flex h-44 flex-col place-content-center justify-start p-4 shadow-sm hover:bg-gray-100 ${data.isSelected ? "border-6 border-red-600 bg-orange-100 transition-all duration-200" : ""} `}
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
            <CardTitle>{data.title}</CardTitle>
            <CardDescription>{data.desc}</CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-2">
            <p>
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
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscountCard;
