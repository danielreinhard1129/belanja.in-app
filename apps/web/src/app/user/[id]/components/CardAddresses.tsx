"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetUserAddress from "@/hooks/api/address/useGetUserAddress";
import { MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";
import DialogShowAddress from "./DialogShowAddress";

const CardAddresses = ({ id }: { id: number }) => {
  const { addresses, refetch } = useGetUserAddress(id);
  const primaryAddress = addresses?.find((addr) => addr.isPrimary);
  const router = useRouter();
  return (
    <Card className="space-y-4 p-4 md:w-[680px] rounded-xl shadow-md h-fit">
      <CardHeader>
        <CardTitle className="flex w-full items-center justify-between">
          <h1>Address</h1>
          <DialogShowAddress userId={id} refetchAddresses={refetch} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        <div className="flex w-full flex-col gap-3">
          {primaryAddress && addresses ? (
            <Card key={primaryAddress.id} className="w-full p-4 shadow-none border-none">
              <CardContent className="flex items-center gap-4 p-0 text-sm text-black/70">
                <div>
                  <MapPinned size={20} className="text-gray-600" />
                </div>
                <p>
                  {primaryAddress.addressLine},{" "}
                  {primaryAddress.subdistricts.subdistrictName},{" "}
                  {primaryAddress.cities.citName},{" "}
                  {primaryAddress.cities.province.provinceName},{" "}
                  {primaryAddress.cities.postal_code}
                </p>
              </CardContent>
            </Card>
          ) : (
            <p>No address registered yet</p>
          )}
          <Button
            className="w-full px-3 py-2"
            onClick={() => router.push(`/user/${id}/add-address`)}
          >
            Add Address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardAddresses;
