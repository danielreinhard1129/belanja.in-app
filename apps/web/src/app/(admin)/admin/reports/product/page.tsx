"use client";
import React, { useState } from "react";
import BarChartComponent from "../components/BarChart";
import useGetStores from "@/hooks/api/store/useGetStores";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, getDaysInMonth } from "date-fns";
import { useAppSelector } from "@/redux/hooks";
import ItemFilterMonth from "../components/ItemFilterMonth";
import { formatToRupiah } from "@/utils/formatCurrency";
import useGetSalesReportByProduct from "@/hooks/api/report/useGetSalesReportByProduct";
import useGetProducts from "@/hooks/api/product/useGetProducts";
import ImageDataNotFound from "../../../../../../public/no-store.svg";
import Image from "next/image";

const Product = () => {
  const { role } = useAppSelector((state) => state.user);
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(`${now.getMonth() + 1}`);
  const [filterYear, setFilterYear] = useState("2024");
  const [storeId, setStoreId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const { data: salesReportData } = useGetSalesReportByProduct({
    filterMonth,
    filterYear,
    storeId,
    productId,
  });

  const { stores } = useGetStores();
  const { products } = useGetProducts();

  const handleStoreChange = (value: string) => {
    setStoreId(value);
  };

  const handleProductChange = (value: string) => {
    setProductId(value);
  };

  const handleChangeFilterMonth = (value: string) => {
    setFilterMonth(value);
  };

  const handleChangeFilterYear = (value: string) => {
    setFilterYear(value);
  };

  if (!salesReportData) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-7">
        <div className="text-center text-xl font-bold">Data Not Found</div>
        <div>
          <Image
            src={ImageDataNotFound}
            alt="ImageDataNotFound"
            width={600}
            height={600}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>
    );
  }

  const incomeDailyData =
    salesReportData?.data.incomeDaily.map((income, index) => ({
      label: `Day ${index + 1}`,
      amount: income,
    })) || [];

  const transactionDailyData =
    salesReportData?.data.transactionDaily.map((transaction, index) => ({
      label: `Day ${index + 1}`,
      amount: transaction,
    })) || [];

  const incomeMonthlyData =
    salesReportData?.data.incomeMonthly.map((income, index) => ({
      label: `Month ${index + 1}`,
      amount: income,
    })) || [];

  const transactionMonthlyData =
    salesReportData?.data.transactionMonthly.map((transaction, index) => ({
      label: `Month ${index + 1}`,
      amount: transaction,
    })) || [];

  return (
    <main className="container my-10 max-w-6xl border-2 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="grid grid-cols-2 items-center gap-5">
          <div className="col-span-1">
            <div className="flex gap-4">
              <div className="bg-mythemes-secondaryblue/25 w-[300px] rounded-3xl p-6">
                <p className="text-1xl whitespace-nowrap text-gray-500">
                  Total Volume
                </p>
                <p className="text-3xl font-semibold text-gray-700">
                  {formatToRupiah(salesReportData?.data.totalIncome)}
                </p>
              </div>
              <div className="bg-mythemes-secondaryblue/25 w-1/3 rounded-3xl p-6">
                <p className="text-1xl whitespace-nowrap text-gray-500">
                  Total Transaction
                </p>
                <p className="text-3xl font-semibold text-gray-700">
                  {salesReportData?.data.totalTransaction}
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex justify-end gap-4">
              {role === "SUPERADMIN" && (
                <Select onValueChange={handleStoreChange}>
                  <SelectTrigger className="w-[150px]">
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
              )}
              <Select onValueChange={handleProductChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Products" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                name="month"
                onValueChange={handleChangeFilterMonth}
                defaultValue={`${now.getMonth() + 1}`}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={"Month"} />
                </SelectTrigger>
                <ItemFilterMonth />
              </Select>
              <Select
                name="sortYear"
                onValueChange={handleChangeFilterYear}
                defaultValue="2024"
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={"Sort By"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <BarChartComponent data={incomeDailyData} title="Daily Income Report" />
        <BarChartComponent
          data={incomeMonthlyData}
          title="Monthly Income Report"
        />
      </div>
      <div className="grid grid-cols-2">
        <BarChartComponent
          data={transactionDailyData}
          title="Daily Transaction Report"
        />
        <BarChartComponent
          data={transactionMonthlyData}
          title="Monthly Transaction Report"
        />
      </div>
    </main>
  );
};

export default Product;
