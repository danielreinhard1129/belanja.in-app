"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookMarked } from "lucide-react";
import React, { useState } from "react";
import DialogSettingStoreProducts from "./DialogSettingStoreProducts";
import DialogStockActionSuperAdmin from "./DialogStockActionSuperAdmin";
import DialogStockMutation from "./DialogStockMutation";
interface PopoverStockMenuProps {
  storeId: number;
  refetch: () => void;
}
const PopoverStockRequest: React.FC<PopoverStockMenuProps> = ({
  storeId,
  refetch,
}) => {
  const [isDialogSettingStoreProducts, setIsDialogSettingStoreProducts] =
    useState<boolean>(false);
  const [isDialogStockMutation, setIsDialogStockMutation] =
    useState<boolean>(false);
  return (
    <Popover>
      <PopoverTrigger>
        <div className="inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-[#ff6100] px-4 py-2 text-sm font-medium text-white">
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
        <DialogStockMutation
          storeId={storeId}
          refetch={refetch}
          open={isDialogStockMutation}
          onOpenChange={setIsDialogStockMutation}
        />
        <DialogStockActionSuperAdmin storeId={storeId} refetch={refetch} />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStockRequest;
