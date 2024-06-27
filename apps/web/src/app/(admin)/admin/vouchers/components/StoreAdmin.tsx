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
import DialogEditVoucher from "./DialogEditVoucher";
import DialogCreateVoucher from "./DialogCreateVoucher";
import useGetVouchersByStoreAdmin from "@/hooks/api/vouchers/useGetVouchersByStoreAdmin";

const VouchersStoreAdmin = () => {
  const [isOpenDialogEdit, setIsOpenDialogEdit] = useState<boolean>(false);
  const [isOpenDialogCreate, setIsOpenDialogCreate] = useState<boolean>(false);
  const { vouchers, refetch } = useGetVouchersByStoreAdmin();
  // const storeId = 1;
  return (
    <main className="container mx-auto">
      <div className="container my-20 max-w-6xl border-2 pb-10 shadow-xl">
        <div className="my-4 flex justify-end">
          <DialogCreateVoucher
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
              {/* {vouchers && vouchers.length > 0 ? (
                vouchers.map((voucher, index) => (
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
                      <DialogEditVoucher
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
              )} */}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default VouchersStoreAdmin;
