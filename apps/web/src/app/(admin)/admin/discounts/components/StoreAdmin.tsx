"use client";
import React, { useEffect, useState } from "react";
import { formatToRupiah } from "@/utils/formatCurrency";
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
import ImageNotFoundStore from "../../../../../../public/no-store.svg";
import { useAppSelector } from "@/redux/hooks";
import useGetStoreByStoreAdmin from "@/hooks/api/store/useGetStoreByStoreAdmin";
import Image from "next/image";

const DiscountsStoreAdmin = () => {
  const { id } = useAppSelector((state) => state.user);
  const { store } = useGetStoreByStoreAdmin(id);
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

  if (!store) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-7">
        <div className="text-center text-xl font-bold">
          You don&#39;t have any store
        </div>
        <div>
          <Image
            src={ImageNotFoundStore}
            alt="ImageNotFoundStore"
            width={600}
            height={600}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto mb-10 max-w-6xl border-2 pb-6 shadow-xl">
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
                  <TableCell>{discount.discountvalue} %</TableCell>
                  <TableCell>{discount.discountLimit}</TableCell>
                  <TableCell>{discount.product.name}</TableCell>
                  <TableCell>{formatToRupiah(discount.minPurchase)}</TableCell>
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
    </main>
  );
};

export default DiscountsStoreAdmin;
