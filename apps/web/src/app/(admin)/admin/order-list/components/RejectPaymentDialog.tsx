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

interface RejectPaymentDialogProps {
  order: IOrder | null;
  handleReject: () => void;
  openRejectDialog: boolean;
  setOpenRejectDialog: Dispatch<SetStateAction<boolean>>;
}

const RejectPaymentDialog: FC<RejectPaymentDialogProps> = ({
  order,
  handleReject,
  openRejectDialog,
  setOpenRejectDialog,
}) => {
  return (
    <AlertDialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
      <AlertDialogTrigger asChild>
        <Button
          className="h-12 w-36 bg-red-200 px-8 py-2 text-red-600"
          variant={"outline"}
          disabled={order?.status !== OrderStatus.WAITING_ADMIN_CONFIRMATION}
        >
          Reject Payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Payment?</AlertDialogTitle>
          <AlertDialogDescription>
            Make sure payment proof matches the total ammount of purchase.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2"
            onClick={() => {
                handleReject();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RejectPaymentDialog;
