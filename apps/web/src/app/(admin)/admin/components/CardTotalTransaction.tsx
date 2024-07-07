"use client";

import { Card, CardContent } from "@/components/ui/card";
import useGetSalesReport from "@/hooks/api/report/useGetSalesReport";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";

const CardTotalTransaction = () => {
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
    <Card className="relative h-[120px] w-full rounded-xl bg-gradient-to-r from-slate-500 to-slate-800 md:h-[200px]">
      <CardContent className="relative z-20">
        <div className="bg-mythemes-secondaryblue/25 rounded-3xl p-6">
          <p className="text-1xl whitespace-nowrap text-white/70">
            Total Transaction
          </p>
          <p className="text-3xl font-semibold text-white">
            {salesReportData?.data.totalTransaction}
          </p>
        </div>
      </CardContent>
      <ArrowRightLeft
        className="absolute -bottom-10 -right-10 z-10 -rotate-12 text-slate-900"
        size={200}
      />
    </Card>
  );
};

export default CardTotalTransaction;
