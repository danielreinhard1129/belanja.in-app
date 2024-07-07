import { formatToRupiah } from "@/utils/formatCurrency";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BarChartComponentProps {
  data: { label: string; amount: number }[];
  title: string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
}) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: "12px" }} />
          <YAxis
            tickFormatter={(amount) => formatToRupiah(Number(amount))}
            tick={{ fontSize: "10px" }}
          />
          <Tooltip formatter={(amount: number) => formatToRupiah(amount)} />
          <Legend />
          <Bar dataKey="amount" fill="#FF6100" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
