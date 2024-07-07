"use client";

import { Separator } from "@/components/ui/separator";
import { Dispatch, FC, HTMLAttributes, SetStateAction } from "react";
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
import DatePickerWithRange from "./DateRangePicker";
import { DateRange } from "react-day-picker";

interface FilterComponentProps {
  setValueStatus: Dispatch<SetStateAction<OrderStatus | null>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  categories: { id: number; name: string }[];
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
}

const FilterComponent: FC<FilterComponentProps> = ({
  setValueStatus,
  setCategory,
  category,
  categories,
  date,
  setDate,
}) => {
  return (
    <div className="z-30">
      <div className="flex items-center gap-x-4 overflow-x-scroll px-4 py-2">
        <StatusSelect setValueStatus={setValueStatus} />
        <CategorySelect
          setCategory={setCategory}
          categories={categories}
          category={category}
        />
        <DatePickerWithRange  date={date} setDate={setDate}/>
      </div>
      <Separator />
    </div>
  );
};

export default FilterComponent;
