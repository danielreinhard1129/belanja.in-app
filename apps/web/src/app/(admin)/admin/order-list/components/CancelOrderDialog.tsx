import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { IOrder } from "@/types/order.type";
import { Dispatch, FC, SetStateAction } from "react";

interface CancelOrderDialogProps {
  order: IOrder | null;
  handleDelete: () => void;
  openCancelDialog: boolean;
  setOpenCancelDialog: Dispatch<SetStateAction<boolean>>;
}

const CancelOrderDialog: FC<CancelOrderDialogProps> = ({
  order,
  handleDelete,
  openCancelDialog,
  setOpenCancelDialog,
}) => {
  return (
    <AlertDialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2"
            onClick={() => {
              handleDelete();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelOrderDialog;
