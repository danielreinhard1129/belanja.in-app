import AddUserAddressForm from "@/components/form/AddUserAddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogAddAddress({ userId }: { userId: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-3 py-2">
          Add Address
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Add new address for your delivery!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddUserAddressForm userId={userId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
