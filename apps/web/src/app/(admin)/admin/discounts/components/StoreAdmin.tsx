"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogCreateDiscount from "./DialogCreateDiscount";
import useGetDiscountsByStoreAdmin from "@/hooks/api/discounts/useGetDiscountsByStoreAdmin";
import { Ban, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import PopoverDiscountMenu from "./PopoverMenu";
import useDeleteDiscount from "@/hooks/api/discounts/useDeleteDiscount";

const DiscountsStoreAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const { deleteDiscount, isLoading: isDeleting } = useDeleteDiscount();
  const {
    data: discounts,
    refetch,
    meta,
  } = useGetDiscountsByStoreAdmin({
    page,
    take: 5,
    sortBy: "title",
    sortOrder,
    discountType: selectedType,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedType]);

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
  };

  const handleDelete = async (id: number) => {
    await deleteDiscount(id);
    refetch();
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  return (
    <main className="container mx-auto">
      <div className="container my-20 max-w-6xl border-2 pb-10 shadow-xl">
        <div className="my-4 flex justify-between">
          <Select onValueChange={handleTypeChange} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="BOGO">BOGO</SelectItem>
              <SelectItem value="PRODUCT">PRODUCT</SelectItem>
              <SelectItem value="MIN_PURCHASE">MIN_PURCHASE</SelectItem>
            </SelectContent>
          </Select>
          <DialogCreateDiscount
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
                    <TableCell>{discount.discountvalue}</TableCell>
                    <TableCell>{discount.discountLimit}</TableCell>
                    <TableCell>{discount.product.name}</TableCell>
                    <TableCell>{discount.minPurchase}</TableCell>
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
                  <TableCell colSpan={8} className="text-center">
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

export default DiscountsStoreAdmin;
