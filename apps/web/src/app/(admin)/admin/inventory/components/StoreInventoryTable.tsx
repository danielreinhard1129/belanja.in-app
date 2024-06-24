import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { AddStockModal } from "./AddStockModal";
import { Input } from "@/components/ui/input";
import PopoverStockMenu from "./PopoverStockMenu";

interface StoreInventoryTableProps {
  storeId: number;
  filteredStocks: any;
  takeStock: number;
  handleChangePaginateStock: ({ selected }: { selected: number }) => void;
  stocks: any;
  refetch: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const StoreInventoryTable: React.FC<StoreInventoryTableProps> = ({
  storeId,
  filteredStocks,
  takeStock,
  handleChangePaginateStock,
  stocks,
  refetch,
  search,
  setSearch,
}) => {
  return (
    <main>
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
        <PopoverStockMenu refetch={refetch} storeId={storeId} />
      </div>
      <div className="my-4 mb-10 border-2 p-5 shadow-xl">
        <Table>
          <TableCaption>A list of your store.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks && filteredStocks.length > 0 ? (
              filteredStocks.map((data: any, istore: any) => (
                <TableRow key={istore}>
                  <TableCell className="font-medium">{istore + 1}</TableCell>
                  <TableCell>{data.product.name}</TableCell>
                  <TableCell>{data.qty}</TableCell>
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
            <p>Total Quantity Store: </p>
            <p className="font-bold">{stocks?.stockSum[0]?.totalStock}</p>
          </div>
        </div>
        <div className="mx-auto w-fit">
          <Pagination
            total={filteredStocks?.length || 0}
            take={takeStock}
            onChangePage={handleChangePaginateStock}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreInventoryTable;
