// Reports.tsx
"use client";
import React, { useState } from "react";
import BarChartComponent from "./components/BarChart";
import useGetReports from "@/hooks/api/transaction/useGetReports";
import useGetStores from "@/hooks/api/store/useGetStores";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useGetProducts from "@/hooks/api/product/useGetProducts";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [storeId, setStoreId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const { data: reports } = useGetReports({
    filterDate: date,
    storeId,
    categoryId,
    productId,
  });
  const { stores } = useGetStores();
  const { categories } = useGetCategories();
  const { products } = useGetProducts();

  const handleStoreChange = (value: string) => {
    setStoreId(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
  };

  const handleProductChange = (value: string) => {
    setProductId(value);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setPopoverOpen(false);
  };

  const processDataForChart = () => {
    if (!reports) return [];

    let chartData = [];

    if (storeId && reports.salesReport) {
      const data = reports.salesReport.map((report) => ({
        // name: report.storeName,
        name: report.createdAt,
        sales: report.totalAmount,
      }));
      chartData.push({
        label: "Sales Report by Store",
        data,
      });
    }

    if (categoryId && reports.salesReportByCategory) {
      const data = reports.salesReportByCategory.map((report) => ({
        // name: report.categoryName,
        name: report.createdAt,
        sales: report.totalAmount,
      }));
      chartData.push({
        label: "Sales Report by Category",
        data,
      });
    }

    if (productId && reports.salesReportByProduct) {
      const data = reports.salesReportByProduct.map((report) => ({
        // name: report.productName,
        name: report.createdAt,
        sales: report.totalAmount,
      }));
      chartData.push({
        label: "Sales Report by Product",
        data,
      });
    }

    return chartData;
  };

  const chartData = processDataForChart();

  return (
    <main className="container my-10 max-w-6xl">
      <div className="mb-4 flex justify-between">
        <div className="relative flex">
          <X
            onClick={() => setDate(undefined)}
            className={`text-mythemes-maingreen absolute bottom-1.5 right-2 h-5 w-5 cursor-pointer ${
              date === undefined ? "hidden" : "block"
            }`}
          />
          <div className="flex flex-col">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start px-4 py-2 text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    handleDateSelect(selectedDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
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

        <div>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={handleProductChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {chartData.map((data, index) => (
        <div key={index} className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">{data.label}</h3>
          <BarChartComponent data={data.data} />
        </div>
      ))}
    </main>
  );
};

export default Reports;
