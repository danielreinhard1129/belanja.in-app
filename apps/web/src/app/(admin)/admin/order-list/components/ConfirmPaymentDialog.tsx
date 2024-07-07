import React, { Dispatch, FC, SetStateAction } from "react";
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

interface ConfirmPaymentDialogProps {
  order: IOrder | null;
  handleConfirm: () => void;
  openConfirmDialog: boolean;
  setOpenConfirmDialog: Dispatch<SetStateAction<boolean>>;
}

const ConfirmPaymentDialog: FC<ConfirmPaymentDialogProps> = ({
  order,
  handleConfirm,
  openConfirmDialog,
  setOpenConfirmDialog,
}) => {
  return (
    <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
         <AlertDialogTrigger asChild>
        <Button
          className="h-12 w-36 bg-green-200 px-8 py-2 text-green-600 border-green-800 hover:bg-green-600 "
          variant={"outline"}
          disabled={order?.status !== OrderStatus.WAITING_ADMIN_CONFIRMATION}
        >
          Confirm Payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment?</AlertDialogTitle>
          <AlertDialogDescription>
            Make sure payment proof matches the total ammount of purchase.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2"
            onClick={() => {
                handleConfirm();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmPaymentDialog;
