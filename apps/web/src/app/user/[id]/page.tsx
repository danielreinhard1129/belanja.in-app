"use client";

import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import avatarDefault from "../../../../public/default-avatar.png";
import { ChevronLeft, Circle, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import useGetUser from "@/hooks/api/auth/useGetUser";
import useGetUserAddress from "@/hooks/api/address/useGetUserAddress";
import DialogShowAddress from "./components/DialogShowAddress";

const UserDetail = () => {
  const { id } = useAppSelector((state) => state.user);
  const { user } = useGetUser(id);
  const { addresses } = useGetUserAddress(user?.id || id);
  const router = useRouter();

  const {
    isLoading: isSendingChangePassword,
    sendChangePassword,
    onSuccess,
  } = useSendChangePassword();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onSuccess) {
      alert(`Email for change password has been sent to ${user?.email}`);
    }
  }, [onSuccess, user]);

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      router.push(`/user/${id}/edit-profile`);
    } catch (error) {
      console.error("Error during profile edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const primaryAddress = addresses?.find((addr) => addr.isPrimary);

  return (
    <>
      {user ? (
        <div className="container flex flex-col items-center gap-4 overflow-hidden px-4 md:items-start md:px-0">
          <div className="z-50 flex h-fit w-full items-center pt-4">
            <Button
              variant="ghost"
              className="px-0 py-0"
              onClick={() => router.push("/")}
            >
              <ChevronLeft color="white" />
            </Button>
          </div>
          <div className="absolute top-0 z-0 h-[160px] w-[140vw] self-center rounded-b-full bg-[#FF6100] md:rounded-none"></div>
          <div className="z-50 flex w-full flex-col items-center md:items-start">
            <div className="relative mt-10 h-32 w-32 overflow-hidden rounded-full border-4 border-white">
              <Image
                src={
                  user?.avatarUrl
                    ? `${appConfig.baseUrl}/assets${user.avatarUrl}`
                    : avatarDefault
                }
                alt="profile picture"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
              <div className="pt-4 text-xl font-medium">{user?.name}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      className="px-2 py-2"
                      onClick={handleEditProfile}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Loading..."
                      ) : (
                        <div className="flex gap-4">
                          <Edit size={20} />
                          <p>Edit Profile</p>
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="w-full">
            <h1>Profile Details</h1>
            {user.gender && <div>{user.gender}</div>}
            {user.birthDate && (
              <div>{format(new Date(user.birthDate), "dd MMMM yyyy")}</div>
            )}
            <div>
              <h1>Address</h1>
              <div>
                {primaryAddress && addresses ? (
                  <Card key={primaryAddress.id} className="w-fit p-4">
                    <CardContent className="flex items-center gap-4 p-0 text-sm text-black/70">
                      <div>
                        <Circle
                          fill="#FF6100"
                          size={12}
                          className="text-[#FF6100]"
                        />
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
                  <div>No address registered</div>
                )}
              </div>
              <DialogShowAddress userId={id} />
            </div>
            <Button
              className="px-4 py-2"
              onClick={() => sendChangePassword({ id })}
              disabled={isSendingChangePassword}
            >
              {isSendingChangePassword ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default UserDetail;
