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
import useGetDiscountsBySuperAdmin from "@/hooks/api/discounts/useGetDiscountsBySuperAdmin";
import useGetStores from "@/hooks/api/store/useGetStores";
import { useState } from "react";

const DiscountsSuperAdmin = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const { discounts, refetch } = useGetDiscountsBySuperAdmin({
    storeId: selectedStoreId,
  });
  const { stores } = useGetStores();

  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value);
  };

  console.log(discounts);
  return (
    <main className="container mx-auto mb-10 max-w-6xl border-2 py-5 shadow-xl">
      <div className="flex justify-between">
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

export default DiscountsSuperAdmin;
