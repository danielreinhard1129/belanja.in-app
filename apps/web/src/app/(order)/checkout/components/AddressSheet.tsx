import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Dispatch, FC, SetStateAction } from "react";
import AddressCard from "./AddressCard";
import { AddressData } from "@/types/address.type";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddressSheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  addresses: AddressData;
  closeDrawer: (addresses: AddressData) => void;
  refetch: () => void;
  userId: number
}

const AddressSheet: FC<AddressSheetProps> = ({
  openState,
  setOpenState,
  addresses,
  closeDrawer,
  refetch,
  userId
}) => {
  const handleSelectAddress = (index: number) => {
    closeDrawer(
      addresses.map((val, idx) => {
        return { ...val, isSelected: idx == index };
      }),
    );
    setOpenState(false);
    refetch();
  };
  const router =useRouter()
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent
        side={"bottom"}
        className="flex h-2/3 flex-col gap-4 overflow-y-scroll rounded-t-lg"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-start">
            Address Details
          </SheetTitle>
        </SheetHeader>
        {!addresses.length ? (
          <div className="flex justify-center align-middle">
            <Button className="w-64 items-center" variant={"ghost"} onClick={()=>router.push(`/user/${userId}/add-address`)}>
              Add address <PlusCircle />
            </Button>
          </div>
        ) : (
          addresses.map((address, index) => {
            return (
              <AddressCard
                key={index}
                data={address}
                closeDrawer={() => handleSelectAddress(index)}
              />
            );
          })
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddressSheet;
