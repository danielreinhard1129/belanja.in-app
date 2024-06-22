import React from "react";
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
import { Button } from "@/components/ui/button";

interface DeleteManyAlertDialogProps {
  productId: number[];
  handleDeletes: (productId: number[]) => void;
  isDeletes: boolean;
}
const DeleteManyAlertDialog: React.FC<DeleteManyAlertDialogProps> = ({
  productId,
  handleDeletes,
  isDeletes,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="px-4 py-2">
          <Trash2 size={20} />
        </Button>
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
            disabled={isDeletes}
            onClick={() => handleDeletes(productId)}
            className="ml-2 px-4 py-2"
          >
            {isDeletes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeletes ? "Loading" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteManyAlertDialog;
