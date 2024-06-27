"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import React, { useState } from "react";
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
    useState<boolean>(false);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          <span>Stock</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-32 text-xs">
        <DialogStockMutation
          storeId={storeId}
          refetch={refetch}
          open={isDialogMutationStock}
          onOpenChange={setIsDialogMutationStock}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStockMenu;
