"use client";

import { Separator } from "@/components/ui/separator";
import { Dispatch, FC, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus } from "@/types/order.type";
import StatusSelect from "./StatusSelect";
import CategorySelect from "@/app/(admin)/admin/products/components/CategorySelect";

interface FilterComponentProps {
  //   orderStatus: OrderStatus;
  setValueStatus: Dispatch<SetStateAction<OrderStatus | null>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  categories: { id: number; name: string }[];
}

const FilterComponent: FC<FilterComponentProps> = ({
  setValueStatus,
  setCategory,
  category,
  categories,
}) => {
  return (
    <div className="z-30">
      <div className="flex gap-x-4 overflow-x-scroll px-4 py-2 items-center">
        <StatusSelect setValueStatus={setValueStatus} />
        <CategorySelect
          setCategory={setCategory}
          categories={categories}
          category={category}
        />
      </div>
      <Separator />
    </div>
  );
};

export default FilterComponent;
