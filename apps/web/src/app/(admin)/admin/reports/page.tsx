"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import useGetReports from "@/hooks/api/transaction/useGetReports";
import { Calendar } from "@/components/ui/calendar";

// interface Order {
//   id: number;
//   totalAmount: number;
//   createdAt: string; // Ubah sesuai dengan tipe yang sesuai untuk tanggal pembelian
//   // Tambahkan properti lain yang diperlukan dari struktur data order
// }

const Reports = () => {
  const { data, isLoading } = useGetReports({ year: "" });
  const [date, setDate] = useState<Date>();

  // Function to format data for the LineChart
  const formatChartData = (orders: any[]) => {
    return orders.map((order) => ({
      date: format(new Date(order.createdAt), "MMM d"),
      totalAmount: order.totalAmount,
    }));
  };

  // Data for the LineChart
  const chartData = data ? formatChartData(data.data) : [];

  const renderLineChart = (
    <LineChart
      width={600}
      height={300}
      data={chartData}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="totalAmount" stroke="#ff7300" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );

  return (
    <main className="container mx-auto my-10 max-w-6xl">
      <div>
        <Popover>
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
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="py-4">{renderLineChart}</div>
    </main>
  );
};

export default Reports;
