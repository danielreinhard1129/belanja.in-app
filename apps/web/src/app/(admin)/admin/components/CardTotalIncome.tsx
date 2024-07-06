"use client";

import { Card, CardContent } from "@/components/ui/card";
import useGetSalesReport from "@/hooks/api/report/useGetSalesReport";
import { formatToRupiah } from "@/utils/formatCurrency";
import { HandCoins } from "lucide-react";
import { useState } from "react";

const CardTotalIncome = () => {
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(`${now.getMonth() + 1}`);
  const [filterYear, setFilterYear] = useState("2024");
  const [storeId, setStoreId] = useState<string>("");
  const { data: salesReportData } = useGetSalesReport({
    filterMonth,
    filterYear,
    storeId,
  });
  return (
    <Card className="relative rounded-xl w-full h-[120px] md:h-[200px] bg-gradient-to-r from-indigo-500 to-blue-500">
      <CardContent className="relative z-20">
        <div className="rounded-3xl p-6">
          <p className="text-1xl text-white/70">
            Total Income
          </p>
          <p className="text-3xl font-semibold text-white">
            {formatToRupiah(Number(salesReportData?.data.totalIncome))}
          </p>
        </div>
      </CardContent>
      <HandCoins className="absolute -bottom-10 -right-10 -rotate-12 text-blue-700 z-0" size={200} />
    </Card>
  );
};

export default CardTotalIncome;
