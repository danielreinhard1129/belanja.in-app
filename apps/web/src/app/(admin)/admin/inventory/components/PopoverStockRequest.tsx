"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";
import React, { useState } from "react";
import DialogStockMutation from "./DialogStockMutation";
import { NotebookPen } from "lucide-react";
import DialogAddProducts from "./DialogSettingStoreProducts";
import DialogSettingStoreProducts from "./DialogSettingStoreProducts";

interface PopoverStockMenuProps {
  storeId: number;
  refetch: () => void;
}

const PopoverStockRequest: React.FC<PopoverStockMenuProps> = ({
  storeId,
  refetch,
}) => {
  const [isDialogMutationStock, setIsDialogMutationStock] =
    useState<boolean>(false);
  const [isDialogSettingStoreProducts, setIsDialogSettingStoreProducts] =
    useState<boolean>(false);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4" />
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
        <DialogSettingStoreProducts
          storeId={storeId}
          refetch={refetch}
          open={isDialogSettingStoreProducts}
          onOpenChange={setIsDialogSettingStoreProducts}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStockRequest;
