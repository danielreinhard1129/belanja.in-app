import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Address } from "@/types/address.type";

interface AddressCardProps {
  data: Address;
  closeDrawer: () => void;
}

const AddressCard: FC<AddressCardProps> = ({ data, closeDrawer }) => {
  return (
    <div>
      <Card
        className={`flex h-44 flex-col place-content-center justify-start p-4 hover:bg-gray-100 shadow-sm ${data.isSelected ? "bg-orange-100 border-red-600 border-6 transition-all duration-200 " : ""} `}
        onClick={() => closeDrawer()}
      >
        <CardHeader>
          <div className="min-h-4">
            {data.isPrimary ? (
              <Badge
                variant="outline"
                className="flex w-[56px] justify-center rounded-sm bg-zinc-300 px-0.5 py-0.5 align-middle text-xs text-zinc-600"
              >
                <p>Primary</p>
              </Badge>
            ) : null}
          </div>
          <CardTitle>{data.user.name}</CardTitle>
          <CardDescription>{data.addressLine}</CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-2" >
          <p>
            <span>{data.subdistricts.subdistrictName}, </span>
            <span>{data.cities.citName}, </span>
            <span>{data.cities.province.provinceName}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressCard;
