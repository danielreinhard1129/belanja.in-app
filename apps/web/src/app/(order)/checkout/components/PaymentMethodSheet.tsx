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
import Image from "next/image";
import bca from "../../../../../public/Logo BCA_Biru.png";
import qris from "../../../../../public/quick-response-code-indonesia-standard-qris-logo-F300D5EB32-seeklogo.com.png";
import { Wallet } from "lucide-react";

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
        className="flex h-fit flex-col gap-4 overflow-y-scroll rounded-t-lg"
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
            <Label htmlFor="option-one" className="w-full">
              <div className="flex h-16 w-full flex-row items-center justify-between gap-4 rounded-lg border px-4 py-2">
                <p>Digital Payment</p>
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-20">
                    <Image src={bca} alt="bca" fill className="object-cover" />
                  </div>
                  <div className="relative h-5 w-14">
                    <Image
                      src={qris}
                      alt="qris"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value={PaymentMethodArgs.MANUAL_TRANSFER}
              id="option-two"
            />
            <Label htmlFor="option-two" className="w-full">
              <div className="flex h-16 w-full flex-row items-center justify-between gap-4 rounded-lg border px-4 py-2">
                <p>Manual Payment</p>
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </SheetContent>
    </Sheet>
  );
};

export default PaymentMethodSheet;
