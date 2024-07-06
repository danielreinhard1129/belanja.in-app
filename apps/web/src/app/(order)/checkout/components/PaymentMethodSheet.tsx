"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethodArgs } from "@/types/order.type";

interface PaymentMethodSheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  radioValue: PaymentMethodArgs;
  setRadioValue: Dispatch<SetStateAction<PaymentMethodArgs>>;
}

const PaymentMethodSheet: FC<PaymentMethodSheetProps> = ({
  openState,
  setOpenState,
  radioValue,
  setRadioValue,
}) => {
  const handleSelect = (value: string) => {
    setRadioValue(value as PaymentMethodArgs);
    setOpenState(false);
  };
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent
        side={"bottom"}
        className="flex h-2/3 flex-col gap-4 overflow-y-scroll rounded-t-lg"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-start">Payment Method</SheetTitle>
        </SheetHeader>
        <RadioGroup
          defaultValue={radioValue as string}
          onValueChange={(value) => handleSelect(value as PaymentMethodArgs)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={PaymentMethodArgs.DIGITAL_PAYMENT}
              id="option-one"
            />
            <Label htmlFor="option-one">Digital Payment</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={PaymentMethodArgs.MANUAL_TRANSFER}
              id="option-two"
            />
            <Label htmlFor="option-two">Manual Transfer</Label>
          </div>
        </RadioGroup>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentMethodSheet;
