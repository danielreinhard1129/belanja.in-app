import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AddressData } from "@/types/address.type";
import { Discount } from "@/types/discount.type";
import DiscountCard from "./DiscountCard";

interface DiscountSheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  discounts: Discount[];
  closeDrawer: (discounts: Discount[]) => void;
  refetch: () => void;
}

const DiscountSheet: FC<DiscountSheetProps> = ({
  openState,
  setOpenState,
  discounts,closeDrawer,
}) => {
  const handleSelectDiscount = (index: number)=>{
    closeDrawer(discounts.map((val, idx)=>{return {...val, isSelected:idx==index}}))
    setOpenState(false)
  }
  
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent
        side={"bottom"}
        className="flex h-2/3 flex-col gap-4 overflow-y-scroll rounded-t-lg"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-start">
            Available Promo
          </SheetTitle>
        </SheetHeader>
        {discounts.map((discount, index) => {
          return (
            // <div key={index}>
            //   <div>{discount.desc}</div>
            //   <div>{discount.discountType}</div>
            //   <div>{discount.discountvalue}%</div>
            // </div>
            <DiscountCard key={index} data={discount} closeDrawer={()=> handleSelectDiscount(index)} />
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default DiscountSheet;
