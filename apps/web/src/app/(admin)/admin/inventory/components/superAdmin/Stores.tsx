"use client";
import Pagination from "@/components/Pagination";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDeleteStore from "@/hooks/api/store/useDeleteStore";
import useGetStoresByParams from "@/hooks/api/store/useGetStoresByParams";
import { debounce } from "lodash";
import React, { useState } from "react";
import { AddStoreModal } from "./AddStoreModal";
import NotificationIcon from "./NotificationStockSuperAdmin";
import PopoverStoreMenu from "./PopoverStoreMenu";

interface StoresProps {
  activeStoreId: string;
  onStoreClick: (storeId: number) => void;
}

const Stores: React.FC<StoresProps> = ({ onStoreClick, activeStoreId }) => {
  const { deleteStore, isLoading: isDeleting } = useDeleteStore();
  const [activePopoverStoreId, setActivePopoverStoreId] = useState<
    number | null
  >(null);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const {
    data: stores,
    refetch,
    meta,
  } = useGetStoresByParams({
    page,
    take: 5,
    sortOrder: "name",
    search,
  });

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 1500);

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

  const handleCardClick = (storeId: number) => {
    onStoreClick(storeId);
    setActivePopoverStoreId(storeId);
  };

  return (
    <main className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-2xl font-bold">Inventory</h2>
      <div className="my-4">
        <div className="flex items-center justify-between">
          <div className="w-[300px]">
            <Input
              type="text"
              placeholder="Search"
              name="search"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <NotificationIcon />
            <AddStoreModal refetch={refetch} />
          </div>
        </div>
      </div>
      <div className="flex gap-7">
        {stores.map((store, i) => (
          <div key={i} onClick={() => handleCardClick(store.id)}>
            <Card
              className={`h-36 w-52 cursor-pointer rounded-lg border p-4 transition duration-300 hover:shadow-md hover:shadow-orange-500 ${
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
                    <div className="w-32 truncate text-lg" title={store.name}>
                      {store.name}
                    </div>
                    {activePopoverStoreId === store.id && (
                      <PopoverStoreMenu
                        refetch={refetch}
                        storeId={Number(store.id)}
                        handleDelete={handleDelete}
                        isDeleting={isDeleting}
                      />
                    )}
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">
                  Location : {store.City.citName}
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
    </main>
  );
};

export default Stores;
