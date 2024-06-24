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

interface StoreAdminProps {
  stocks: Stock;
  stockPage: number;
  handleChangePaginateStock: ({ selected }: { selected: number }) => void;
}

const StoreAdmin: React.FC<StoreAdminProps> = ({
  stocks,
  stockPage,
  handleChangePaginateStock,
}) => {
  const filteredStocks = stocks?.storeProducts?.data;
  return (
    <main className="mx-auto my-10 max-w-4xl">
      <h3 className="text-xl font-bold">Store Inventory</h3>
      <div className="my-8 mb-10 border-2 p-5 shadow-xl">
        <Table>
          <TableCaption>A list of your stock</TableCaption>
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
            <p>Total Quantity Store: </p>
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
