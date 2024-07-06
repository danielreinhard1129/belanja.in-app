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
    <Card className="relative h-full pb-0 md:pb-10 pt-14 px-6 w-full rounded-xl">
      <CardContent className="relative z-20">
        <BarChartComponent
          data={incomeMonthlyData}
          barColor="#8884d8"
          title="Income Report"
        />
      </CardContent>
    </Card>
  );
};

export default CardMonthlyIncome;
