"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import useGetUserAddress from "@/hooks/api/address/useGetUserAddress";
import useSetPrimaryAddress from "@/hooks/api/address/useSetPrimaryAddress";
import { Circle, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDeleteUserAddress from "@/hooks/api/address/useDeleteUserAddress";

const DialogShowAddress = ({ userId }: { userId: number }) => {
  const { addresses } = useGetUserAddress(userId);
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { setPrimaryAddress, isLoading } = useSetPrimaryAddress(
    selectedAddressId!,
    userId,
  );
  const { deleteAddress } = useDeleteUserAddress();

  useEffect(() => {
    const primaryAddress = addresses?.find((address) => address.isPrimary);
    if (primaryAddress) {
      setSelectedAddressId(primaryAddress.id);
    }
  }, [addresses]);

  const handleSelectAddress = (addressId: number) => {
    setSelectedAddressId(addressId);
  };

  const handleSave = async () => {
    if (selectedAddressId !== null) {
      await setPrimaryAddress({ isPrimary: true });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleDelete = (addressId: number) => {
    deleteAddress(addressId);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-3 py-2">
          Show Address
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your address</DialogTitle>
          <Button
            className="px-3 py-2"
            onClick={() => router.push(`/user/${userId}/add-address`)}
          >
            Add Address
          </Button>
        </DialogHeader>
        {addresses ? (
          <div className="grid gap-4 py-4">
            {addresses.map((address) => (
              <Card key={address.id} className="group w-full p-4">
                <CardContent className="flex w-full items-center gap-4 p-0 text-sm text-black/70">
                  <div>
                    <Circle
                      fill={
                        selectedAddressId === address.id
                          ? "#FF6100"
                          : "transparent"
                      }
                      size={12}
                      onClick={() => handleSelectAddress(address.id)}
                      className={`${
                        selectedAddressId === address.id
                          ? "text-[#FF6100]"
                          : "text-[#c5c5c5]"
                      } cursor-pointer`}
                    />
                  </div>
                  <div>
                    <p>
                      {address.addressLine},{" "}
                      {address.subdistricts.subdistrictName},{" "}
                      {address.cities.citName},{" "}
                      {address.cities.province.provinceName},{" "}
                      {address.postalCode}
                    </p>
                  </div>
                  <Popover modal={openDialog}>
                    <PopoverTrigger className="h-fit">
                      <EllipsisVertical size={16} />
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <div className="z-50 grid gap-2">
                        <Button
                          variant="link"
                          className="px-2 py-1"
                          onClick={() => {
                            router.push(
                              `/user/${userId}/edit-address/${address.id}`,
                            );
                          }}
                        >
                          Edit address
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="link"
                              className="px-3 py-1 text-red-500"
                            >
                              Delete address
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure want to delete this address?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="px-3 py-2">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="px-3 py-2"
                                onClick={() => handleDelete(address.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? "Deleting..." : "Confirm delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>You haven&apos;t set any address</div>
        )}
        {selectedAddressId !== null && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="px-3 py-2">Save</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="px-3 py-2">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="px-3 py-2"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogShowAddress;
