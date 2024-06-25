"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import DeleteAlertDialog from "./DeleteAlertDialog";
import DialogEditProduct from "./DialogEditProduct";
import DialogDetailProduct from "./DialogDetailProduct";
import { Eye } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";

interface DropdownActionProps {
  productId: number;
  isDeleting: boolean;
  handleDelete: (id: number) => void;
  refetch: () => void;
}

const DropdownAction: React.FC<DropdownActionProps> = ({
  productId,
  isDeleting,
  handleDelete,
  refetch,
}) => {
  const [dialogOpen, setDialogOpen] = useState<{ [key: string]: boolean }>({});

  const handleDialogOpen = (id: string) => {
    setDialogOpen((prev) => ({ ...prev, [id]: true }));
  };

  const handleDialogClose = (id: string) => {
    setDialogOpen((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleDialogOpen("edit")}>
          <div className="flex justify-evenly gap-2">
            <Pencil size={20} />
            Edit
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDialogOpen("delete")}>
          <div className="flex justify-evenly gap-2">
            <Trash2 size={20} />
            Delete
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleDialogOpen("detail")}>
          <div className="flex justify-evenly gap-2">
            <Eye size={20} />
            View Detail
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {dialogOpen["edit"] && (
        <DialogEditProduct
          open={dialogOpen["edit"]}
          onOpenChange={(open) => !open && handleDialogClose("edit")}
          productId={productId}
          refetch={refetch}
        />
      )}

      {dialogOpen["delete"] && (
        <DeleteAlertDialog
          open={dialogOpen["delete"]}
          onOpenChange={() => handleDialogClose("delete")}
          productId={productId}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
        />
      )}

      {dialogOpen["detail"] && (
        <DialogDetailProduct
          open={dialogOpen["detail"]}
          onOpenChange={(open) => !open && handleDialogClose("detail")}
          productId={productId}
        />
      )}
    </DropdownMenu>
  );
};

export default DropdownAction;
