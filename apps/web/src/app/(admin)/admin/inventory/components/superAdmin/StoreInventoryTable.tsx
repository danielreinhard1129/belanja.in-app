import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUpdateIsActiveStoreProduct from "@/hooks/api/store-product/useUpdateIsActiveStoreProduct";
import React from "react";
import PopoverStockRequest from "./PopoverStockRequest";

interface StoreInventoryTableProps {
  storeId: number;
  filteredStocks: any;
  takeStock: number;
  handleChangePaginateStock: ({ selected }: { selected: number }) => void;
  stocks: any;
  refetch: () => void;
  handleSearch: (value: string) => void;
}

const StoreInventoryTable: React.FC<StoreInventoryTableProps> = ({
  storeId,
  filteredStocks,
  takeStock,
  handleChangePaginateStock,
  stocks,
  refetch,
  handleSearch,
}) => {
  const { updateIsActiveStoreProduct } = useUpdateIsActiveStoreProduct();
  const handleUpdateIsActive = async (
    isActive: boolean,
    storeProductId: number,
  ) => {
    await updateIsActiveStoreProduct(isActive, storeProductId);
    refetch();
  };
  return (
    <main className="mx-auto max-w-6xl">
      <h3 className="text-xl font-bold">Store Inventory</h3>
      <div className="mt-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search"
          name="search"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-[300px]"
        />
        <div className="flex justify-between gap-4">
          <PopoverStockRequest refetch={refetch} storeId={storeId} />
        </div>
      </div>
      <div className="my-4 mb-10 border-2 bg-white p-5 shadow-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks && filteredStocks.length > 0 ? (
              filteredStocks.map((data: any, istore: any) => (
                <TableRow key={istore}>
                  <TableCell className="font-medium">{istore + 1}</TableCell>
                  <TableCell>{data.product.name}</TableCell>
                  <TableCell>{data.product.id}</TableCell>
                  <TableCell>{data.qty}</TableCell>
                  <TableCell>
                    <Switch
                      checked={data.isActive}
                      onCheckedChange={(checked) =>
                        handleUpdateIsActive(checked, data.id)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
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
            take={takeStock}
            onChangePage={handleChangePaginateStock}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreInventoryTable;
