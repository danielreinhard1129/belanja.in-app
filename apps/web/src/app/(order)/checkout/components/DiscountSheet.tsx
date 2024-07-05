import React, { Dispatch, FC, SetStateAction } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
  } from "@/components/ui/sheet";
import { AddressData } from '@/types/address.type';
import { Discount } from '@/types/discount.type';

  interface DiscountSheetProps{
    openState: boolean;
    setOpenState: Dispatch<SetStateAction<boolean>>;
    discounts: Discount[]
  }

const DiscountSheet:FC<DiscountSheetProps> = ({openState,setOpenState,discounts}) => {
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
    <SheetContent side={"bottom"} className="h-2/3 flex flex-col gap-4 overflow-y-scroll rounded-t-lg ">
      <SheetHeader >
        <SheetTitle className="flex justify-start">Available Promo</SheetTitle>
      </SheetHeader>
      {discounts.map((discount, index)=>{
          return (
            <div key={index}></div>
          // <AddressCard key={index} data={address} closeDrawer={()=> handleSelectAddress(index)} />
        )
      })}
      
    </SheetContent>
  </Sheet>
  )
}

export default DiscountSheet