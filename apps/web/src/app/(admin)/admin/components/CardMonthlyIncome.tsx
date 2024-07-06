"use client";

import { Card, CardContent } from "@/components/ui/card";
import useGetSalesReport from "@/hooks/api/report/useGetSalesReport";
import { useState } from "react";
import BarChartComponent from "../reports/components/BarChart";

const CardMonthlyIncome = () => {
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(`${now.getMonth() + 1}`);
  const [filterYear, setFilterYear] = useState("2024");
  const [storeId, setStoreId] = useState<string>("");
  const { data: salesReportData } = useGetSalesReport({
    filterMonth,
    filterYear,
    storeId,
  });

  const incomeMonthlyData =
    salesReportData?.data.incomeMonthly.map((income, index) => ({
      label: `Month ${index + 1}`,
      amount: income,
    })) || [];
  return (
    <Card className="relative h-full w-full rounded-xl px-6 pb-0 pt-14 md:pb-10">
      <CardContent className="relative z-20">
        <BarChartComponent data={incomeMonthlyData} title="Income Report" />
      </CardContent>
    </Card>
  );
};

export default CardMonthlyIncome;
