"use client";
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
import useGetStores from "@/hooks/api/store/useGetStores";
import useGetVouchersBySuperAdmin from "@/hooks/api/vouchers/useGetVouchersBySuperAdmin";
import { Ban, Check } from "lucide-react";
import { useState } from "react";

const VouchersSuperAdmin = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const { vouchers, refetch } = useGetVouchersBySuperAdmin({
    storeId: selectedStoreId,
  });
  const { stores } = useGetStores();

  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value);
  };

  console.log(vouchers);
  return (
    <main className="container mx-auto mb-10 max-w-6xl border-2 py-5 shadow-xl">
      {/* <div className="flex justify-between">
        <div>
          <Select onValueChange={handleStoreChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div> */}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Voucher Type</TableHead>
              <TableHead>Discount Value</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vouchers && vouchers.length > 0 ? (
              vouchers.map((voucher, index) => (
                <TableRow key={voucher.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{voucher.code}</TableCell>
                  <TableCell>{voucher.description}</TableCell>
                  <TableCell>{voucher.voucherType}</TableCell>
                  <TableCell>{voucher.discountValue}</TableCell>
                  <TableCell>{voucher.products.name}</TableCell>
                  <TableCell>
                    {voucher.isActive ? (
                      <Check style={{ color: "green" }} />
                    ) : (
                      <Ban style={{ color: "red" }} />
                    )}
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
    </main>
  );
};

export default VouchersSuperAdmin;
