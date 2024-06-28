"use client";

import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import avatarDefault from "../../../../../public/default-avatar.png";
import { ChevronLeft, Edit } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const UserDetail = () => {
  const { id, name, avatarUrl, email, gender, birthDate } = useAppSelector(
    (state) => state.user,
  );
  const router = useRouter();

  const {
    isLoading: isSendingChangePassword,
    sendChangePassword,
    onSuccess,
  } = useSendChangePassword();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onSuccess) {
      alert(`Email for change password has been sent to ${email}`);
    }
  }, [onSuccess, email]);

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

  return (
    <div className="container flex flex-col items-center gap-4 overflow-hidden px-4 md:items-start md:px-0">
      <div className="z-50 flex h-fit w-full items-center pt-4">
        <Button variant="ghost" className="px-0 py-0">
          <ChevronLeft color="white" />
        </Button>
      </div>
      <div className="absolute top-0 z-0 h-[160px] w-[140vw] self-center rounded-b-full bg-[#FF6100] md:rounded-none"></div>
      <div className="z-50 flex w-full flex-col items-center md:items-start">
        {/* {avatarUrl ? (
          <div className="relative mt-10 h-32 w-32 overflow-hidden rounded-full border-4 border-white">
            <Image
              src={`${appConfig.baseUrl}/assets${avatarUrl}`}
              alt="profile picture"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative mt-10 h-32 w-32 overflow-hidden rounded-full">
            <Image
              src={avatarDefault}
              alt="profile picture"
              fill
              className="object-cover"
            />
          </div>
        )} */}
        <div className="relative mt-10 h-32 w-32 overflow-hidden rounded-full border-4 border-white">
            <Image
              src={`${appConfig.baseUrl}/assets${avatarUrl}`}
              alt="profile picture"
              fill
              className="object-cover"
            />
          </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
          <div className="pt-4 text-xl font-medium">{name}</div>
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
        <div>Address</div>
        {gender ? <div>{gender}</div> : <div></div>}
        {birthDate ? (
          <div>{format(new Date(birthDate), "dd MMMM yyyy")}</div>
        ) : (
          <div></div>
        )}

        <Button
          className="px-4 py-2"
          onClick={() => sendChangePassword({ id })}
          disabled={isSendingChangePassword}
        >
          {isSendingChangePassword ? "Loading..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
};

export default UserDetail;
