import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DialogDeleteStore from "./DialogDeleteStore";
import { MoreVertical } from "lucide-react";
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
      <PopoverContent className="w-32">
        <div>
          <DialogDeleteStore
            storeId={storeId}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            open={isDialogDeleteStore}
            onOpenChange={setIsDialogDeleteStore}
          />
          <DialogEditStore
            refetch={refetch}
            storeId={storeId}
            open={isDialogEditStore}
            onOpenChange={setIsDialogEditStore}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverStoreMenu;
