import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BadgePercent, ChevronRight } from "lucide-react";

const DiscountCard = ({
  title,
  discountValue,
  discountType,
  discountLimit,
  minPurchase,
  index,
}: {
  index: any;
  title: string;
  discountValue: number;
  discountType: string;
  discountLimit: number;
  minPurchase: number;
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          key={index}
          className="rounded-lg bg-gradient-to-r cursor-pointer from-red-500 to-orange-500 pt-4"
        >
          <CardContent className="relative flex w-full justify-between">
            <div className="flex items-center gap-2">
              <BadgePercent className="text-white animate-wiggle duration-1000" />
              <p className="text-sm text-white">
                Enjoy {discountValue}% discount!
              </p>
            </div>
            <ChevronRight className="text-white" />
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="px-3 pb-6">
        <DrawerHeader>Available Discount</DrawerHeader>
        <Card key={index} className="rounded-lg">
          <CardContent className="flex w-full flex-row gap-4 px-4 py-4">
            <div className="flex items-center gap-2">
              <BadgePercent fill="gray" className="text-white" />
            </div>
            <div className="flex w-full flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">
                Enjoy {discountValue}% discount!
              </p>
              <p className="text-xs text-gray-600">
                Up to{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(discountLimit)),
                  ).toFixed().length,
                }).format(Number(discountLimit))}{" "}
                with min. purchase{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: Math.trunc(
                    Math.abs(Number(minPurchase)),
                  ).toFixed().length,
                }).format(Number(minPurchase))}
              </p>
            </div>
            <ChevronRight className="text-white" />
          </CardContent>
        </Card>
      </DrawerContent>
    </Drawer>
  );
};

export default DiscountCard;
