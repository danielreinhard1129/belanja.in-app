import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import React from "react";
import DialogDeleteStore from "./DialogDeleteStore";
import { DialogEditStore } from "./DialogEditStore";

interface PopoverMenuProps {
  storeId: number;
  isDeleting: boolean;
  handleDelete: (storeId: number) => void;
  refetch: () => void;
}

const PopoverStoreMenu: React.FC<PopoverMenuProps> = ({
  storeId,
  isDeleting,
  handleDelete,
  refetch,
}) => {
  const [isDialogDeleteStore, setIsDialogDeleteStore] = React.useState(false);
  const [isDialogEditStore, setIsDialogEditStore] = React.useState(false);
  return (
    <Popover>
      <PopoverTrigger>
        <MoreVertical className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-32 text-xs">
        <div>
          <DialogEditStore
            refetch={refetch}
            storeId={storeId}
            open={isDialogEditStore}
            onOpenChange={setIsDialogEditStore}
          />
          <DialogDeleteStore
            storeId={storeId}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            open={isDialogDeleteStore}
            onOpenChange={setIsDialogDeleteStore}
          />
          <Link href={`/admin/inventory/${storeId}`}>
            <div className="flex cursor-pointer items-center gap-2">
              <Eye size={16} /> View Detail
            </div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStoreMenu;
