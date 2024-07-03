import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetUserAddress from "@/hooks/api/address/useGetUserAddress";
import { Circle, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

const DialogShowAddress = ({ userId }: { userId: number }) => {
  const { addresses } = useGetUserAddress(userId);
  const router = useRouter();
  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          {addresses.map((address) => (
            <Card key={address.id} className="group w-full p-4">
              <CardContent className="flex w-full items-center gap-4 p-0 text-sm text-black/70">
                {address.isPrimary ? (
                  <div>
                    <Circle
                      fill="#FF6100"
                      size={12}
                      className="text-[#FF6100]"
                    />
                  </div>
                ) : (
                  <div>
                    <Circle size={12} className="text-[#c5c5c5c5]" />
                  </div>
                )}
                <div>
                  <p>
                    {address.addressLine},{" "}
                    {address.subdistricts.subdistrictName},{" "}
                    {address.cities.citName},{" "}
                    {address.cities.province.provinceName},{" "}
                    {address.postalCode}
                  </p>
                </div>
                <div className="h-full">
                  <Button
                    variant="ghost"
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    onClick={() =>
                      router.push(
                        `/user/${userId}/edit-address/${address.id}`,
                      )
                    }
                  >
                    <EllipsisVertical size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogShowAddress;
