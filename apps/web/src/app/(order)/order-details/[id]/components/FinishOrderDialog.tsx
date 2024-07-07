import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IOrder, OrderStatus } from "@/types/order.type";

interface FinishOrderDialogProps {
  order: IOrder;
  handleFinish: ()=> void;
}

const FinishOrderDialog: FC<FinishOrderDialogProps> = ({ order, handleFinish }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="h-12 w-32 bg-green-200 px-4 py-2 text-green-600 border-green-800 hover:bg-green-600 "
          variant={"outline"}
          disabled={order.status !== OrderStatus.ORDER_SHIPPED}
        >
          Finish Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finish your order?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. MAKE SURE YOU HAVE CORRECTLY RECEIVED THE ITEMS YOU ORDERED.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction className="px-4 py-2" onClick={()=>{handleFinish()}}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FinishOrderDialog;
