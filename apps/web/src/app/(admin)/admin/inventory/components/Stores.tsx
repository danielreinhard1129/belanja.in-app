"use client";
import Pagination from "@/components/Pagination";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddStoreModal } from "./AddStoreModal";
import useDeleteStore from "@/hooks/api/store/useDeleteStore";
import PopoverStoreMenu from "./PopoverStoreMenu";
import useGetStoresByParams from "@/hooks/api/store/useGetStoresByParams";

interface StoresProps {
  activeStoreId: string;
  onStoreClick: (storeId: number) => void;
}

const Stores: React.FC<StoresProps> = ({ onStoreClick, activeStoreId }) => {
  const { deleteStore, isLoading: isDeleting } = useDeleteStore();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const {
    data: stores,
    refetch,
    meta,
  } = useGetStoresByParams({
    page,
    take: 4,
    sortOrder: "name",
    search,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleDelete = async (storeId: number) => {
    await deleteStore(storeId);
    refetch();
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  if (!stores) {
    return <div>Data Not Found</div>;
  }

  // console.log(stores);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between">
          <h2 className="mb-4 text-2xl font-bold">Inventory</h2>
          <AddStoreModal refetch={refetch} />
        </div>
      </div>
      <div className="mx-1 flex gap-5">
        {stores.map((store, i) => (
          <div key={i} onClick={() => onStoreClick(store.id)}>
            <Card
              className={`h-36 w-48 cursor-pointer rounded-lg border p-4 transition duration-300 hover:shadow-md hover:shadow-orange-500 ${
                store.id === Number(activeStoreId)
                  ? "shadow-md shadow-orange-500"
                  : !store.storeAdmin?.user.name
                    ? "shadow-yellow-500"
                    : "shadow"
              }`}
            >
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between">
                    <div>{store.name}</div>
                    <PopoverStoreMenu
                      refetch={refetch}
                      storeId={Number(store.id)}
                      handleDelete={handleDelete}
                      isDeleting={isDeleting}
                    />
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  Location : {store.city}
                </CardDescription>
              </CardHeader>
              <div className="items-center text-left text-xs">
                <div>
                  Responsible : <br />
                  {store.storeAdmin?.user.name ? (
                    store.storeAdmin.user.name
                  ) : (
                    <span className="text-red-500">Nothing</span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 w-fit">
        <Pagination
          total={total}
          take={take}
          onChangePage={handleChangePaginate}
        />
      </div>
    </div>
  );
};

export default Stores;
