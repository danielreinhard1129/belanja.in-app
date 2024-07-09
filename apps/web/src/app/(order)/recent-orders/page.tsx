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
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

const RecentOrders = () => {
  const [search, setSearch] = useState<string>("");
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
    toDate: date?.to?.toISOString(),
    search,
  });
  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);

  return isLoadingOrders ? (
    <div className="flex flex-col gap-y-2 p-4">
      <SkeletonOrderCard />
    </div>
  ) : !orders.length ? (
    <main className="mx-auto mt-20 md:container relative">
      <div className="fixed top-20 w-[88%]">
        <Input
          type="text"
          placeholder="Search for order number..."
          name="search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="ml-4 mt-2 w-52"
        />
        <FilterComponent
          setValueStatus={setOrderStatus}
          setCategory={setCategory}
          category={category}
          categories={categories}
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="z-0 flex flex-col items-center gap-y-2 p-4 mt-56 bg-white">
        Nothing to see here...
      </div>
    </main>
  ) : (
    <main className="mx-auto md:container relative">
       <div className="fixed top-20 w-[88%]">
        <Input
          type="text"
          placeholder="Search for order number..."
          name="search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="ml-4 mt-2 w-52"
        />
        <FilterComponent
          setValueStatus={setOrderStatus}
          setCategory={setCategory}
          category={category}
          categories={categories}
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="z-0 flex flex-col items-center gap-y-2 p-4 mt-56 bg-white w-full">
        {orders.map((order, i) => {
          return (
            <OrderCard
              orderId={String(order.id)}
              orderNumber={order.orderNumber}
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
