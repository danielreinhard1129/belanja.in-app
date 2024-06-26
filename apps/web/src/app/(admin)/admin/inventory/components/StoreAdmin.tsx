import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Stock } from "@/types/stock.type";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import PopoverStockRequest from "./PopoverStockRequest";

interface StoreAdminProps {
  stocks: Stock;
  stockPage: number;
  handleChangePaginateStock: ({ selected }: { selected: number }) => void;
  search: string;
  refetch: () => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const StoreAdmin: React.FC<StoreAdminProps> = ({
  stocks,
  stockPage,
  handleChangePaginateStock,
  search,
  refetch,
  setSearch,
}) => {
  const filteredStocks = stocks?.storeProducts?.data;
  const storeId = stocks?.storeProducts?.data[0]?.store.id;
  // console.log(storeId);
  // console.log(filteredStocks);

  return (
    <main className="mx-auto my-10 max-w-4xl">
      <h3 className="text-xl font-bold">Store Inventory</h3>
      <div className="mt-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px]"
        />
        <PopoverStockRequest refetch={refetch} storeId={storeId} />
      </div>
      <div className="my-4 mb-10 border-2 p-5 shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks && filteredStocks.length > 0 ? (
              filteredStocks.map((store, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{store.product.name}</TableCell>
                  <TableCell>{store.qty}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="border-b px-4 py-2 text-center"
                >
                  Data Not Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <div className="mr-10 mt-2 flex gap-4">
            <p>Total Quantity Products: </p>
            <p className="font-bold">{stocks?.stockSum[0]?.totalStock}</p>
          </div>
        </div>
        <div className="mx-auto w-fit">
          <Pagination
            total={filteredStocks?.length || 0}
            take={5}
            onChangePage={handleChangePaginateStock}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreAdmin;
