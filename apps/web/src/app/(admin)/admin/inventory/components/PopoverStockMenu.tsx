import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical } from "lucide-react";
import React from "react";
import DialogStockMutation from "./DialogStockMutation";

interface PopoverStockMenuProps {
  storeId: number;
  refetch: () => void;
}

const PopoverStockMenu: React.FC<PopoverStockMenuProps> = ({
  storeId,
  refetch,
}) => {
  const [isDialogMutationStock, setIsDialogMutationStock] =
    React.useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <span>Stock</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-32">
        <DialogStockMutation storeId={storeId} refetch={refetch} />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStockMenu;
