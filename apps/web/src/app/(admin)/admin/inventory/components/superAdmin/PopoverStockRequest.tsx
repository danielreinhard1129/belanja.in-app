"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotebookPen } from "lucide-react";
import React, { useState } from "react";
import DialogSettingStoreProducts from "./DialogSettingStoreProducts";
// import DialogRequestStockMutation from "../storeAdmin/DialogRequestStockMutation";
import { BookMarked } from "lucide-react";
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
        {/* <DialogRequestStockMutation
          storeId={storeId}
          refetch={refetch}
          open={isDialogRequestStockMutation}
          onOpenChange={setIsDialogRequestStockMutation}
        /> */}
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
