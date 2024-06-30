import React, { Dispatch, FC, SetStateAction } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
  } from "@/components/ui/sheet";
import { Address } from '@/types/user.type';

  interface DiscountSheetProps{
    openState: boolean;
    setOpenState: Dispatch<SetStateAction<boolean>>;
    addresses: Address[]
  }

const DiscountSheet:FC<DiscountSheetProps> = ({openState,setOpenState,addresses}) => {
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
    <SheetContent side={"bottom"} className="h-2/3 flex flex-col gap-4 overflow-y-scroll rounded-t-lg ">
      <SheetHeader >
        <SheetTitle className="flex justify-start">Available Promo</SheetTitle>
      </SheetHeader>
      {addresses.map((address, index)=>{
          return (
            <div key={index}></div>
        //   <AddressCard key={index} data={address} closeDrawer={()=> handleSelectAddress(index)} />
        )
      })}
      
    </SheetContent>
  </Sheet>
  )
}

export default DiscountSheet