"use client";
import React, { useState } from "react";
import OrderTable from "./components/OrderTable";
import useGetAllUserOrders from "@/hooks/api/transaction/useGetAllUserOrders";
import useGetOrderDetailsByAdmin from "@/hooks/api/transaction/useGetOrderDetailsByAdmin";
import FilterComponent from "@/app/(order)/recent-orders/components/FilterComponent";
import { OrderStatus } from "@/types/order.type";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetStores from "@/hooks/api/store/useGetStores";
import { useAppSelector } from "@/redux/hooks";

const OrderList = () => {
  const { role: adminRole } = useAppSelector((state) => state.user);
  const [page, setPage] = useState<number>(1);
  const [openState, setOpenState] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [date, setDate] = useState<DateRange | undefined>();
  const { categories } = useGetCategories();
  const [orderId, setOrderId] = useState<number | undefined>();
  const [storeId, setStoreId] = useState<string>("all");
  const { stores } = useGetStores();
  const {
    orders,
    isLoading: isLoadingOrders,
    meta: ordersMeta,
    refetch: refetchOrders,
  } = useGetAllUserOrders({
    page,
    take: 5,
    status: orderStatus,
    category,
    fromDate: date?.from?.toISOString(),
    toDate: date?.to?.toISOString(),
    storeId,
  });
  const {
    order,
    isLoading: isLoadingOrderDetails,
    setOrder,
    refetch: refetchOrder,
  } = useGetOrderDetailsByAdmin({ orderId });

  const handleStoreChange = (value: string) => {
    setStoreId(value);
  };

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <main className="container py-20">
      <div className="container mx-auto mb-10 max-w-6xl border-2 shadow-xl">
        {adminRole === "STOREADMIN" ? null : adminRole === "SUPERADMIN" ? (
          <Select onValueChange={handleStoreChange} defaultValue="all">
            <SelectTrigger className="m-4 mb-2 w-[180px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <FilterComponent
          setValueStatus={setOrderStatus}
          setCategory={setCategory}
          category={category}
          categories={categories}
          date={date}
          setDate={setDate}
        />
        <OrderTable
          orders={orders}
          order={order}
          isLoadingOrders={isLoadingOrders}
          openState={openState}
          orderId={orderId}
          setOpenState={setOpenState}
          setOrderId={setOrderId}
          isLoadingOrder={isLoadingOrderDetails}
          setOrder={setOrder}
          ordersMeta={ordersMeta}
          handleChangePaginate={handleChangePaginate}
          refetchOrder={refetchOrder}
          refetchOrders={refetchOrders}
        />
      </div>
    </main>
  );
};

export default OrderList;
