import { IOrder } from "@/types/order.type";
import { BASE_API_URL } from "@/utils/config";
import Image from "next/image";
import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PaymentProofDialog: FC<{ order: IOrder, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({ order,open,setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Proof</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="relative h-[400px] w-full rounded-sm border">
          <Image
            alt="paymentProof"
            fill
            src={`${BASE_API_URL}/assets${order.Payment?.paymentProof}`}
            className="object-cover"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProofDialog;
