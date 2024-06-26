import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DeleteAlertDialog from "./DeleteAlertDialog";
import DialogEditProduct from "./DialogEditProduct";
import DialogDetailProduct from "./DialogDetailProduct";
import { MoreHorizontal } from "lucide-react";

interface PopoverMenuProps {
  productId: number;
  isDeleting: boolean;
  handleDelete: (productId: number) => void;
  refetch: () => void;
}

const PopoverProductMenu: React.FC<PopoverMenuProps> = ({
  productId,
  isDeleting,
  handleDelete,
  refetch,
}) => {
  const [deleteAlertDialog, isDeleteAlertDialog] = React.useState(false);
  const [dialogEditProduct, isDialogEditProduct] = React.useState(false);
  const [dialogDetailProduct, isDialogDetailProduct] = React.useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        <MoreHorizontal className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-32 text-xs">
        <div className="mb-2 text-center font-bold">Action</div>
        <div>
          <DialogEditProduct
            refetch={refetch}
            productId={productId}
            open={dialogEditProduct}
            onOpenChange={isDialogEditProduct}
          />
          <DeleteAlertDialog
            productId={productId}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            open={deleteAlertDialog}
            onOpenChange={isDeleteAlertDialog}
          />
          <DialogDetailProduct
            open={dialogDetailProduct}
            onOpenChange={isDialogDetailProduct}
            productId={productId}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverProductMenu;
