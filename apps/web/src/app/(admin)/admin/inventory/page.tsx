"use client";
import useGetStockByRuleNew from "@/hooks/api/store-product/useGetStockByRuleNew";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useState } from "react";
import ImageChooseStore from "../../../../../public/superAdminCS.svg";
import StoreAdmin from "./components/StoreAdmin";
import StoreInventoryTable from "./components/StoreInventoryTable";
import Stores from "./components/Stores";

const Inventory = () => {
  const { role } = useAppSelector((state) => state.user);
  const [stockPage, setStockPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [activeStoreId, setActiveStoreId] = useState<string>("");
  const { stocks, isLoading, refetch, metaStock } = useGetStockByRuleNew({
    page: stockPage,
    take: 5,
    search,
    storeId: activeStoreId,
  });

  const handleStoreClick = (storeId: number) => {
    setActiveStoreId(storeId.toString());
  };

  const handleChangePaginateStock = ({ selected }: { selected: number }) => {
    setStockPage(selected + 1);
  };

  const handleDelete = async (id: number) => {
    refetch();
  };

  const takeStock = metaStock?.take || 1;

  const filteredStocks = Number(activeStoreId)
    ? stocks?.storeProducts?.data.filter(
        (storeProduct) => storeProduct.store.id === Number(activeStoreId),
      )
    : stocks?.storeProducts?.data;

  if (!stocks) {
    return <div>Data Not Found</div>;
  }

  // console.log(stocks);

  return (
    <>
      {role === "SUPERADMIN" && (
        <div className="container mx-auto my-10 max-w-6xl">
          <Stores
            onStoreClick={handleStoreClick}
            activeStoreId={activeStoreId}
          />

          {activeStoreId ? (
            <>
              <StoreInventoryTable
                storeId={Number(activeStoreId)}
                search={search}
                setSearch={setSearch}
                filteredStocks={filteredStocks}
                takeStock={takeStock}
                handleChangePaginateStock={handleChangePaginateStock}
                stocks={stocks}
                refetch={refetch}
              />
            </>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center gap-7">
              <div className="text-center text-xl font-bold">
                Choose a store
              </div>
              <div>
                <Image
                  src={ImageChooseStore}
                  alt="ImageChooseStore"
                  width={600}
                  height={600}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {role === "STOREADMIN" && (
        <StoreAdmin
          stocks={stocks}
          search={search}
          setSearch={setSearch}
          stockPage={stockPage}
          handleChangePaginateStock={handleChangePaginateStock}
          refetch={refetch}
        />
      )}
    </>
  );
};

export default Inventory;
