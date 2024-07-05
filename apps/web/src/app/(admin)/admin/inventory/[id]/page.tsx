"use client";
import useGetStore from "@/hooks/api/store/useGetStore";
import ImgAvatar from "../../../../../../public/male_avatar.svg";
import Image from "next/image";
import React from "react";
import ImageDataNotFound from "../../../../../../public/no-store.svg";

const StoreDetail = ({ params }: { params: { id: string } }) => {
  const { store } = useGetStore(Number(params.id));
  if (!store) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-7">
        <div className="text-center text-xl font-bold">Data Not Found</div>
        <div>
          <Image
            src={ImageDataNotFound}
            alt="ImageDataNotFound"
            width={600}
            height={600}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>
    );
  }
  return (
    <main className="container mx-auto my-auto max-w-6xl border-2 p-8 shadow-xl">
      <div className="mx-auto my-auto flex items-center justify-between">
        <div className="mx-auto flex flex-col gap-8">
          <h1 className="text-4xl font-bold">{store.name} Store</h1>
          <div className="grid w-full grid-cols-6 gap-2">
            <div className="col-span-2 font-semibold">Store Admin</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.storeAdmin?.user?.name ?? "Not Found"}
            </div>
            <div className="col-span-2 font-semibold">NIP</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.storeAdmin?.nip ?? "Not Found"}
            </div>
            <div className="col-span-2 font-semibold">Email</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.storeAdmin?.user?.email ?? "Not Found"}
            </div>
            <div className="col-span-2 font-semibold">Gender</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.storeAdmin?.user?.gender ?? "Not Found"}
            </div>
            <div className="col-span-2 font-semibold">Store ID</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{store.id ?? "Not Found"}</div>
            <div className="col-span-2 font-semibold">Quantity</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">{store.qty ?? "Not Found"}</div>
            <div className="col-span-2 font-semibold">City</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-3">
              {store.City?.citName ?? "Not Found"}
            </div>
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

export default StoreDetail;
