"use client";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import { useAppSelector } from "@/redux/hooks";
import ImgAvatar from "../../../../../public/male_avatar.svg";
import Image from "next/image";
import React, { useEffect } from "react";
import useGetStoreByStoreAdmin from "@/hooks/api/store/useGetStoreByStoreAdmin";
import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";

const Profile = () => {
  const { id } = useAppSelector((state) => state.user);
  const { user } = useGetUser(id);
  const { store } = useGetStoreByStoreAdmin(id);
  const {
    isLoading: isSendingChangePassword,
    sendChangePassword,
    onSuccess,
  } = useSendChangePassword();

  useEffect(() => {
    if (onSuccess) {
      alert(`Email for change password has been sent to ${user?.email}`);
    }
  }, [onSuccess, user]);
  if (!user || !store) return <div>Data not found</div>;
  return (
    <main className="container mx-auto my-auto max-w-6xl border-2 p-8 shadow-xl">
      <div className="mx-auto my-auto flex items-center justify-between">
        <div className="mx-auto flex flex-col gap-8">
          <h1 className="text-4xl font-bold">STORE ADMIN DETAIL</h1>
          <div className="grid w-full grid-cols-6 gap-2">
            <div className="col-span-2 font-semibold">Name</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{user.name}</div>
            <div className="col-span-2 font-semibold">NIP</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{user.storeAdmin.nip}</div>
            <div className="col-span-2 font-semibold">Email</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{user.email}</div>
            <div className="col-span-2 font-semibold">Gender</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{user.gender ?? "Not Found"}</div>
            <div className="col-span-2 font-semibold">Store ID</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{store.id ?? "Not Found"}</div>
            <div className="col-span-2 font-semibold">Store Name</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{store.name ?? "Not Found"}</div>
            <div className="col-span-2 font-semibold">City</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.City?.citName ?? "Not Found"}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="px-4 py-2"
              onClick={() => sendChangePassword({ id })}
              disabled={isSendingChangePassword}
            >
              {isSendingChangePassword ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </div>
        <div>
          <Image
            src={ImgAvatar}
            alt="ImgAvatar"
            width={200}
            height={200}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>
    </main>
  );
};

export default Profile;
