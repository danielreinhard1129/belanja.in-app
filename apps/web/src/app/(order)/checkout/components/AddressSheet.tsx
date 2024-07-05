import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Dispatch, FC, SetStateAction } from "react";
import AddressCard from "./AddressCard";
import { AddressData } from "@/types/address.type";



interface AddressSheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  addresses:AddressData
  closeDrawer: (addresses:AddressData)=>void
  refetch : ()=>void
}



const AddressSheet: FC<AddressSheetProps> = ({ openState, setOpenState, addresses, closeDrawer, refetch }) => {
  const handleSelectAddress = (index: number)=>{
    closeDrawer(addresses.map((val, idx)=>{return {...val, isSelected:idx==index}}))
    setOpenState(false)
    refetch()
  }
  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent side={"bottom"} className="h-2/3 flex flex-col gap-4 overflow-y-scroll rounded-t-lg ">
        <SheetHeader >
          <SheetTitle className="flex justify-start">Address Details</SheetTitle>
        </SheetHeader>
        {addresses.map((address, index)=>{
            return (<AddressCard key={index} data={address} closeDrawer={()=> handleSelectAddress(index)} />)
        })}
        
      </SheetContent>
    </Sheet>
  );
};

export default AddressSheet;
