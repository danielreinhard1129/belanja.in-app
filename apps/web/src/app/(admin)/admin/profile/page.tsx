"use client";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import { useAppSelector } from "@/redux/hooks";
import ImgAvatar from "../../../../../public/male_avatar.svg";
import Image from "next/image";
import React, { useEffect } from "react";
import useGetStoreByStoreAdmin from "@/hooks/api/store/useGetStoreByStoreAdmin";
import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import {
  Building2,
  Fingerprint,
  Mail,
  Map,
  Package,
  ScanFace,
  Store,
  User2,
} from "lucide-react";

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
  if (!user || !store)
    return (
      <main className="container mx-96 my-auto max-w-xl rounded-xl border-2 p-8 shadow-xl">
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          <div className="grid w-full grid-cols-5 gap-2 p-6">
            <div className="col-span-5 mb-4 flex flex-col items-center justify-center gap-4">
              <Image
                src={ImgAvatar}
                alt="ImgAvatar"
                width={120}
                height={120}
                priority
              />
              <h1 className="text-center text-xl font-bold">{user?.name}</h1>
            </div>
            <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
              <User2 size={20} color="gray" /> Store Admin
            </div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-2">{user?.name ?? "Not Found"}</div>
            <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
              <Mail size={20} color="gray" /> Email
            </div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-2">{user?.email ?? "Not Found"}</div>
            <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
              <ScanFace size={20} color="gray" /> NIP
            </div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-2">
              {user?.storeAdmin?.nip ?? "Not Found"}
            </div>
            <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
              <Store size={20} color="gray" /> <span>Store Name</span>
            </div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-2">Not Found</div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              className="px-4 py-2"
              onClick={() => sendChangePassword({ id })}
              disabled={isSendingChangePassword}
            >
              {isSendingChangePassword ? "Loading..." : "Change Password"}
            </Button>
          </div>
        </div>
      </main>
    );
  return (
    <main className="container mx-96 my-auto max-w-xl rounded-xl border-2 p-8 shadow-xl">
      <div className="mx-auto flex flex-col items-center justify-center gap-4">
        <div className="grid w-full grid-cols-5 gap-2 p-6">
          <div className="col-span-5 mb-4 flex flex-col items-center justify-center gap-4">
            <Image
              src={ImgAvatar}
              alt="ImgAvatar"
              width={120}
              height={120}
              priority
            />
            <h1 className="text-center text-xl font-bold">{user.name}</h1>
          </div>
          <div className="gep-4 col-span-2 flex items-center gap-12 font-semibold text-gray-400">
            <Store size={20} color="gray" /> <span>Store Name</span>
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">{store.name ?? "Not Found"}</div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <Fingerprint size={20} color="gray" />
            Store ID
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">{store.id ?? "Not Found"}</div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <Map size={20} color="gray" /> Province
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">
            {store.City?.province.provinceName ?? "Not Found"}
          </div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <Building2 size={20} color="gray" /> City
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">{store.City?.citName ?? "Not Found"}</div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <Package size={20} color="gray" /> Quantity
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">{store.qty ?? "Not Found"}</div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <User2 size={20} color="gray" /> Store Admin
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">
            {store.storeAdmin?.user?.name ?? "Not Found"}
          </div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <Mail size={20} color="gray" /> Email
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">
            {store.storeAdmin?.user?.email ?? "Not Found"}
          </div>
          <div className="col-span-2 flex gap-12 font-semibold text-gray-400">
            <ScanFace size={20} color="gray" /> NIP
          </div>
          <div className="col-span-1 text-center">:</div>
          <div className="col-span-2">
            {store.storeAdmin?.nip ?? "Not Found"}
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button
            className="px-4 py-2"
            onClick={() => sendChangePassword({ id })}
            disabled={isSendingChangePassword}
          >
            {isSendingChangePassword ? "Loading..." : "Change Password"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Profile;
