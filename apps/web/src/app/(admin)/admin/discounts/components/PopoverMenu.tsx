import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import DialogDeleteDiscount from "./DialogDeleteDiscount";
import DialogEditDiscount from "./DialogEditDiscount";

interface PopoverMenuProps {
  discountId: number;
  isDeleting: boolean;
  handleDelete: (discountId: number) => void;
  refetch: () => void;
}

const PopoverDiscountMenu: React.FC<PopoverMenuProps> = ({
  discountId,
  isDeleting,
  handleDelete,
  refetch,
}) => {
  const [deleteAlertDialog, isDeleteAlertDialog] = React.useState(false);
  const [dialogEditDiscount, isDialogEditDiscount] = React.useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        <MoreHorizontal className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-32 text-xs">
        <div className="mb-2 text-center font-bold">Action</div>
        <div>
          <DialogEditDiscount
            refetch={refetch}
            discountId={discountId}
            open={dialogEditDiscount}
            onOpenChange={isDialogEditDiscount}
          />
          <DialogDeleteDiscount
            discountId={discountId}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            open={deleteAlertDialog}
            onOpenChange={isDeleteAlertDialog}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverDiscountMenu;
