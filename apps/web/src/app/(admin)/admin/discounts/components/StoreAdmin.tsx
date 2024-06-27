"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DialogEditDiscount from "./DialogEditDiscount";
import DialogCreateDiscount from "./DialogCreateDiscount";
import useGetDiscountsByStoreAdmin from "@/hooks/api/discounts/useGetDiscountsByStoreAdmin";

const DiscountsStoreAdmin = () => {
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const { discounts, refetch } = useGetDiscountsByStoreAdmin();
  // const storeId = 1;
  return (
    <main className="container mx-auto">
      <div className="container my-20 max-w-6xl border-2 pb-10 shadow-xl">
        <div className="my-4 flex justify-end">
          <DialogCreateDiscount
            // storeId={storeId}
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
                <TableHead>Name</TableHead>
                <TableHead>Discount Type</TableHead>
                <TableHead>Discount Value</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Minimal Purchase</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
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
                    <TableCell>{discount.store.name}</TableCell>
                    <TableCell>{discount.product.name}</TableCell>
                    <TableCell>{discount.minPurchase}</TableCell>
                    <TableCell>{discount.startDate}</TableCell>
                    <TableCell>{discount.endDate}</TableCell>
                    <TableCell>
                      <DialogEditDiscount
                        storeId={discount.storeId}
                        refetch={refetch}
                        open={isOpenDialogEdit}
                        onOpenChange={setIsOpenDialogEdit}
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
      </div>
    </main>
  );
};

export default DiscountsStoreAdmin;
