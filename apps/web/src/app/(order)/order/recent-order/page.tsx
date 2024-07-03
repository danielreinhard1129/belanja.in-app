"use client";
import useGetUserOrders from "@/hooks/api/transaction/useGetUserOrders";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import OrderCard from "./components/OrderCard";
import Pagination from "@/components/Pagination";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import { OrderStatus } from "@/types/order.type";
import FilterComponent from "./components/FilterComponent";
import SkeletonOrderCard from "./components/SkeletonOrderCard";
import { DateRange } from "react-day-picker";
import { addDays, toDate } from "date-fns";

const RecentOrders = () => {
  const [page, setPage] = useState<number>(1);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>();
  const { categories } = useGetCategories();
  const { id } = useAppSelector((state) => state.user);
  const {
    orders,
    isLoading: isLoadingOrders,
    meta: ordersMeta,
  } = useGetUserOrders({
    id,
    page,
    take: 10,
    status: orderStatus,
    category,
    fromDate: date?.from?.toISOString(),
    toDate: date?.to?.toISOString()
  });
  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  console.log("ini date", date);

  return isLoadingOrders ? (
    // <p className="">Loading...</p>
    <div className="flex flex-col gap-y-2 p-4">
      <SkeletonOrderCard />
    </div>
  ) : !orders.length ? (
    <main className="mx-auto md:container">
      <FilterComponent
        setValueStatus={setOrderStatus}
        setCategory={setCategory}
        category={category}
        categories={categories}
        date={date}
        setDate={setDate}
      />
      <div className="z-0 flex flex-col items-center gap-y-2 p-4">
        Nothing to see here...
      </div>
    </main>
  ) : (
    <main className="mx-auto md:container">
      <FilterComponent
        setValueStatus={setOrderStatus}
        setCategory={setCategory}
        category={category}
        categories={categories}
        date={date}
        setDate={setDate}
      />
      <div className="z-0 flex flex-col gap-y-2 p-4">
        {orders.map((order, i) => {
          return (
            <OrderCard
              orderId={order.id}
              key={i}
              orderStatus={String(order.status)}
              orderItems={order.OrderItems}
              purchaseDate={order.createdAt}
              purchaseTotal={order.totalAmount}
              url={baseURL}
            />
          );
        })}
      </div>
      <div className="mb-4 flex justify-center">
        <Pagination
          total={ordersMeta?.total || 0}
          take={ordersMeta?.take || 0}
          onChangePage={handleChangePaginate}
        />
      </div>
    </main>
  );
};

export default RecentOrders;
