"use client";
import useGetStore from "@/hooks/api/store/useGetStore";
import React from "react";

const StoreDetail = ({ params }: { params: { id: string } }) => {
  const { store } = useGetStore(Number(params.id));
  if (!store) {
    return <div>Data Not Found</div>;
  }
  return (
    <main className="max-h-6xl container mx-auto my-10 max-w-6xl bg-slate-500">
      {/* <div>{store?.name}</div>
      <div>{store?.City?.citName}</div>
      <div>{store?.City?.province?.provinceName}</div>
      <div>{store?.storeAdmin?.nip}</div>
      <div>{store?.storeAdmin?.user?.name}</div>
      <div>{store?.storeAdmin?.user?.avatarUrl}</div>
      <div>{store?.storeAdmin?.user?.email}</div>
      <div>{store?.storeAdmin?.user?.addressId}</div>
      <div>{store?.qty}</div> */}
      <div className="mt-8 flex h-60 w-full justify-between gap-6">
        <div className="h-60 w-full rounded-3xl bg-black"></div>
        <div className="h-60 w-1/3 rounded-full bg-white"></div>
      </div>
      <div className="mt-8 h-60 w-full rounded-3xl bg-red-500"></div>
    </main>
  );
};

export default StoreDetail;
