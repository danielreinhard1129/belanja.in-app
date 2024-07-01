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
import { Loader2, Trash2 } from "lucide-react";
import React from "react";

interface DialogDeleteDiscountProps {
  discountId: number;
  isDeleting: boolean;
  handleDelete: (id: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogDeleteDiscount: React.FC<DialogDeleteDiscountProps> = ({
  discountId,
  isDeleting,
  handleDelete,
  open,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger>
        <div className="mt-1 flex cursor-pointer items-center gap-2">
          <Trash2 size={16} />
          Delete
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            product and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => handleDelete(discountId)}
            className="ml-2 px-4 py-2"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? "Loading" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogDeleteDiscount;
