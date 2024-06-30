import React, { Dispatch, FC, SetStateAction } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";

interface OrderSummarySheetProps {
    openState: boolean;
    setOpenState: Dispatch<SetStateAction<boolean>>;
}

const OrderSummarySheet:FC<OrderSummarySheetProps> = ({openState,setOpenState}) => {
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
    <SheetContent side={"bottom"} className="h-2/3 flex flex-col gap-4 overflow-y-scroll rounded-t-lg ">
      <SheetHeader >
        <SheetTitle className="flex justify-start">Order Summary</SheetTitle>
      </SheetHeader>
        <div></div>
      
    </SheetContent>
  </Sheet>
  )
}

export default OrderSummarySheet