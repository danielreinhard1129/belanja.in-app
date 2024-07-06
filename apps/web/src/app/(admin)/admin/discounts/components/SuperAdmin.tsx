"use client";
import { formatToRupiah } from "@/utils/formatCurrency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetDiscountsBySuperAdmin from "@/hooks/api/discounts/useGetDiscountsBySuperAdmin";
import useGetStores from "@/hooks/api/store/useGetStores";
import { Ban, Check } from "lucide-react";
import { useEffect, useState } from "react";
import DialogCreateDiscountSuperAdmin from "./DialogCreateDiscountSuperAdmin";
import Pagination from "@/components/Pagination";
import PopoverDiscountMenu from "./PopoverMenu";
import useDeleteDiscount from "@/hooks/api/discounts/useDeleteDiscount";

const DiscountsSuperAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const { deleteDiscount, isLoading: isDeleting } = useDeleteDiscount();
  const {
    data: discounts,
    meta,
    refetch,
  } = useGetDiscountsBySuperAdmin({
    page,
    take: 5,
    sortBy: "name",
    sortOrder,
    storeId: selectedStoreId,
  });
  const { stores } = useGetStores();

  useEffect(() => {
    setPage(1);
  }, [selectedStoreId]);

  const handleDelete = async (id: number) => {
    await deleteDiscount(id);
    refetch();
  };

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value);
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;
  return (
    <main className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-2xl font-bold">Discounts</h2>
      <div className="container border-2 bg-white pb-6 shadow-xl">
        <div className="my-4 flex justify-between">
          <div>
            <Select onValueChange={handleStoreChange} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={String(store.id)}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogCreateDiscountSuperAdmin
            refetch={refetch}
            open={isOpenDialogCreate}
            onOpenChange={setIsOpenDialogCreate}
          />
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Discount Value</TableHead>
                <TableHead>Discount Limit</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Minimal Purchase</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts && discounts.length > 0 ? (
                discounts.map((discount, index) => (
                  <TableRow key={discount.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{discount.title}</TableCell>
                    <TableCell>{discount.discountType}</TableCell>
                    <TableCell>{discount.discountvalue} %</TableCell>
                    <TableCell>{discount.discountLimit}</TableCell>
                    <TableCell>{discount.store.name}</TableCell>
                    <TableCell>
                      {discount.product?.name ?? "Not Found"}
                    </TableCell>
                    <TableCell>
                      {formatToRupiah(discount.minPurchase)}
                    </TableCell>
                    <TableCell>
                      {discount.isActive ? (
                        <Check style={{ color: "green" }} />
                      ) : (
                        <Ban style={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <PopoverDiscountMenu
                        discountId={discount.id}
                        isDeleting={isDeleting}
                        handleDelete={handleDelete}
                        refetch={refetch}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Data not found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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

export default DiscountsSuperAdmin;
