import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetStoreByStoreAdmin from "@/hooks/api/store/useGetStoreByStoreAdmin";
import { useAppSelector } from "@/redux/hooks";
import { Stock } from "@/types/stock.type";
import { Ban, Check } from "lucide-react";
import React from "react";
import PopoverStockRequest from "./PopoverStockRequest";

interface StoreAdminProps {
  stocks: Stock;
  take: number;
  total: number;
  page: number;
  handleChangePaginate: ({ selected }: { selected: number }) => void;
  refetch: () => void;
  handleSearch: (value: string) => void;
}

const StoreAdmin: React.FC<StoreAdminProps> = ({
  stocks,
  take,
  total,
  page,
  handleChangePaginate,
  refetch,
  handleSearch,
}) => {
  const filteredStocks = stocks?.storeProducts?.data;
  const { id } = useAppSelector((state) => state.user);
  const { store } = useGetStoreByStoreAdmin(id);
  const storeId = store?.id;

  return (
    <main className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-2xl font-bold">Inventory</h2>
      <div className="container max-w-6xl border-2 bg-white pb-6 shadow-xl">
        <div className="my-4 flex justify-between">
          <Input
            type="text"
            placeholder="Search"
            name="search"
            onChange={(e) => handleSearch(e.target.value)}
            className="w-[300px]"
          />
          <PopoverStockRequest refetch={refetch} storeId={Number(storeId)} />
        </div>
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
              filteredStocks.map((store, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {(page - 1) * take + index + 1}
                  </TableCell>
                  <TableCell>{store.product.name}</TableCell>
                  <TableCell>{store.product.id}</TableCell>
                  <TableCell>{store.qty}</TableCell>
                  <TableCell>
                    {store.isActive ? (
                      <Check style={{ color: "green" }} />
                    ) : (
                      <Ban style={{ color: "red" }} />
                    )}
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
            total={total}
            take={take}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreAdmin;
