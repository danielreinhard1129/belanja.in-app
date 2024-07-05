// components/BarChart.tsx
import { formatToRupiah } from "@/utils/formatCurrency";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartComponentProps {
  data: { label: string; amount: number }[];
  barColor: string;
  title: string;
  total: number | undefined;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  barColor,
  title,
  total,
}) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {total !== undefined && (
        <h3 className="text-lg">{formatToRupiah(total)}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
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
          <XAxis dataKey="label" />
          <YAxis
            tickFormatter={(amount) => formatToRupiah(Number(amount))}
            tick={{ fontSize: "12px" }}
          />
          <Tooltip formatter={(amount: number) => formatToRupiah(amount)} />
          <Legend />
          <Bar dataKey="amount" fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
