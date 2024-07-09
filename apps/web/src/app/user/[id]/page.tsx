"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetUser from "@/hooks/api/auth/useGetUser";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { ChevronLeft, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import avatarDefault from "../../../../public/default-avatar.png";
import CardAddresses from "./components/CardAddresses";
import ProfileSkeleton from "./components/ProfileSkeleton";
import { TabsUser } from "./components/TabsUser";

const UserDetail = () => {
  const { id } = useAppSelector((state) => state.user);
  const { user, isLoading: loadingUser } = useGetUser(id);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

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

  if (id === 0) {
    router.push("/");
    toast.error("Session Expired!");
  }

  return (
    <>
      <div className="container fixed left-0 right-0 z-50 mx-auto flex h-fit w-full items-center justify-between bg-white px-4 pb-4 pt-4">
        <Button
          variant="secondary"
          className="rounded-full p-2 text-black hover:bg-gray-400 hover:text-white"
          onClick={() => router.push("/")}
        >
          <ChevronLeft size={16} />
        </Button>
        <h1 className="text-lg font-medium">Profile</h1>
        <Button
          variant="secondary"
          className="rounded-full p-2 opacity-0"
          onClick={() => router.push("/")}
        >
          <ChevronLeft size={16} color="black" />
        </Button>
      </div>
      {user ? (
        <div className="container flex flex-col gap-4 px-4 pt-20 md:flex-row">
          <Card className="relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-xl px-3 py-6 shadow-md md:items-start">
            <div className="absolute right-0 top-0 h-[90px] w-full bg-[#FF6100]">
              <Image
                src="https://images.unsplash.com/photo-1719527126300-687e4145b97f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                fill
                objectFit="cover"
                alt="bg"
              />
            </div>
            <CardContent className="flex w-full flex-col items-center gap-4 px-2">
              <div className="flex w-full flex-col items-center">
                <div className="relative h-32 w-32">
                  <div className="absolute bottom-0 left-[88px] z-20">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            className="group h-10 w-10 rounded-full border-2 border-white px-2 transition-all duration-300 hover:w-[120px]"
                            onClick={handleEditProfile}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              "Loading..."
                            ) : (
                              <div className="flex items-center gap-2">
                                <Pencil size={14} />
                                <p className="hidden font-normal transition-all group-hover:flex">
                                  Edit profile
                                </p>
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
                  <Image
                    src={
                      user?.avatarUrl
                        ? `${appConfig.baseUrl}/assets${user.avatarUrl}`
                        : avatarDefault
                    }
                    alt="profile picture"
                    fill
                    className="z-10 rounded-full border-4 border-white object-cover"
                  />
                </div>
                <div className="flex w-full flex-col items-center justify-between gap-2 pt-2">
                  <p className="text-xl font-medium">{user?.name}</p>
                </div>
              </div>
              <TabsUser
                email={user.email}
                birthDate={user.birthDate}
                gender={user.gender}
                id={user.id}
              />
              <div className="flex w-full gap-2">
                <Button
                  className="w-full px-4 py-2"
                  onClick={() => router.push(`/user/${id}/change-password`)}
                >
                  Change Password
                </Button>
                <Button
                  className="w-full px-4 py-2"
                  onClick={() => router.push("/recent-orders")}
                >
                  Recent Orders
                </Button>
              </div>
            </CardContent>
          </Card>
          <CardAddresses id={user.id} />
        </div>
      ) : (
        <ProfileSkeleton />
      )}
    </>
  );
};

export default UserDetail;
