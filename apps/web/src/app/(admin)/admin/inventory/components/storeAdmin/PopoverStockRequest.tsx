"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import DialogSettingStoreProducts from "./DialogSettingStoreProducts";
import DialogRequestStockMutation from "./DialogRequestStockMutation";
import DialogStockActionStoreAdmin from "./DialogStockActionStoreAdmin";
import { BookMarked } from "lucide-react";

interface PopoverStockMenuProps {
  storeId: number;
  refetch: () => void;
}

const PopoverStockRequest: React.FC<PopoverStockMenuProps> = ({
  storeId,
  refetch,
}) => {
  const [isDialogStockAction, setIsDialogStockAction] =
    useState<boolean>(false);
  const [isDialogSettingStoreProducts, setIsDialogSettingStoreProducts] =
    useState<boolean>(false);
  const [isDialogRequestStockMutation, setIsDialogRequestStockMutation] =
    useState<boolean>(false);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex items-center gap-2">
          <BookMarked className="h-4 w-4" />
          <span>Stock</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-32 text-xs">
        <DialogSettingStoreProducts
          storeId={storeId}
          refetch={refetch}
          open={isDialogSettingStoreProducts}
          onOpenChange={setIsDialogSettingStoreProducts}
        />
        <DialogRequestStockMutation
          storeId={storeId}
          refetch={refetch}
          open={isDialogRequestStockMutation}
          onOpenChange={setIsDialogRequestStockMutation}
        />
        <DialogStockActionStoreAdmin storeId={storeId} refetch={refetch} />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStockRequest;
