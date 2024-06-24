"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useGetStockByRuleNew from "@/hooks/api/store-product/useGetStockByRuleNew";
import useGetStores from "@/hooks/api/store/useGetStoresByParams";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { AddStoreModal } from "./components/AddStoreModal";
import StockJournalTable from "./components/StockJournalTable";
import StoreAdmin from "./components/StoreAdmin";
import StoreInventoryTable from "./components/StoreInventoryTable";
import Stores from "./components/Stores";

const Inventory = () => {
  const { role } = useAppSelector((state) => state.user);
  const [stockPage, setStockPage] = useState<number>(1);
  // const [stockJournalsPage, setStockJournalsPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [activeStoreId, setActiveStoreId] = useState<string>("");
  const { stocks, isLoading, refetch, metaStock } = useGetStockByRuleNew({
    page: stockPage,
    take: 5,
    // stockJournalsPage,
    // stockJournalsTake: 1,
    search,
    storeId: activeStoreId,
  });

  const handleStoreClick = (storeId: number) => {
    // setStoreId(storeId.toString());
    setActiveStoreId(storeId.toString());
    // setStockJournalsPage(1);
  };

  const handleChangePaginateStock = ({ selected }: { selected: number }) => {
    setStockPage(selected + 1);
  };

  // const handleChangePaginateStockJournal = ({
  //   selected,
  // }: {
  //   selected: number;
  // }) => {
  //   setStockJournalsPage(selected + 1);
  // };

  const handleDelete = async (id: number) => {
    // await deleteProduct(id);
    refetch();
  };

  const takeStock = metaStock?.take || 1;
  // const totalStockJournal = metaStockJournal?.total || 0;
  // const takeStockJournal = metaStockJournal?.take || 1;

  const filteredStocks = Number(activeStoreId)
    ? stocks?.storeProducts?.data.filter(
        (storeProduct) => storeProduct.store.id === Number(activeStoreId),
      )
    : stocks?.storeProducts?.data;

  const filteredStockJournals = Number(activeStoreId)
    ? stocks?.stockJournals?.data.filter(
        (stockJournal) => stockJournal.storeId === Number(activeStoreId),
      )
    : stocks?.stockJournals?.data;

  if (!stocks) {
    return <div>Data Not Found</div>;
  }

  // console.log(stocks);

  return (
    <>
      {role === "SUPERADMIN" && (
        <div className="container mx-auto my-10 max-w-4xl">
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
            <div className="text-center text-xl font-bold">Choose a store</div>
          )}
        </div>
      )}

      {role === "STOREADMIN" && (
        <StoreAdmin
          stocks={stocks}
          stockPage={stockPage}
          handleChangePaginateStock={handleChangePaginateStock}
        />
      )}
    </>
  );
};

export default Inventory;
