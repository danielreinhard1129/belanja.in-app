"use client";
import useGetStoreById from "@/hooks/api/store/useGetStoreById";
import {
  Building2,
  Fingerprint,
  Mail,
  Map,
  Package,
  ScanFace,
  Store,
  User,
} from "lucide-react";
import Image from "next/image";
import ImgAvatar from "../../../../../../public/male_avatar.svg";
import ImageDataNotFound from "../../../../../../public/no-store.svg";

const StoreDetail = ({ params }: { params: { id: string } }) => {
  const { store } = useGetStoreById(Number(params.id));
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
    <main className="container mx-auto my-auto max-w-xl rounded-xl border-2 bg-white p-8 shadow-xl">
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
            <h1 className="text-center text-xl font-bold">
              {store.name} Store
            </h1>
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
            <User size={20} color="gray" /> Store Admin
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
      </div>
    </main>
  );
};

export default StoreDetail;
