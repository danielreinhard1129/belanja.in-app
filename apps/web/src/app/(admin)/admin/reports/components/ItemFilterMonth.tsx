"use client";
import { SelectContent, SelectItem } from "@/components/ui/select";

const ItemFilterMonth = () => {
  return (
    <SelectContent>
      <SelectItem value="1">January</SelectItem>
      <SelectItem value="2">February</SelectItem>
      <SelectItem value="3">March</SelectItem>
      <SelectItem value="4">April</SelectItem>
      <SelectItem value="5">May</SelectItem>
      <SelectItem value="6">June</SelectItem>
      <SelectItem value="7">July</SelectItem>
      <SelectItem value="8">Agust</SelectItem>
      <SelectItem value="9">September</SelectItem>
      <SelectItem value="10">Oktober</SelectItem>
      <SelectItem value="11">November</SelectItem>
      <SelectItem value="12">Desember</SelectItem>
    </SelectContent>
  );
};

export default ItemFilterMonth;
