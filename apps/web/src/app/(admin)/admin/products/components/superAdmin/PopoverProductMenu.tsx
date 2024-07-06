import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, MoreHorizontal } from "lucide-react";
import React from "react";
import DeleteAlertDialog from "./DeleteAlertDialog";
import DialogEditProduct from "./DialogEditProduct";
import Link from "next/link";

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
          <Link href={`/admin/products/${productId}`}>
            <div className="flex cursor-pointer items-center gap-2">
              <Eye size={16} /> View Detail
            </div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverProductMenu;
