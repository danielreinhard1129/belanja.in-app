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
import { Trash2 } from "lucide-react";
import { FC } from "react";

interface AlertDialogRemoveItemProps {
  cartId: number
  handleRemoveItem: (index: number, id:number) => void;

  index: number;
  isLoadingIndex: number | null;
}

const AlertDialogRemoveItem: FC<AlertDialogRemoveItemProps> = ({
  handleRemoveItem,
  index,
  isLoadingIndex,cartId
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="mr-4 rounded-sm px-2 py-1"
          disabled={index === isLoadingIndex}
          variant={"outline"}
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">No</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleRemoveItem(index, cartId)} className="px-4 py-2">
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogRemoveItem;
