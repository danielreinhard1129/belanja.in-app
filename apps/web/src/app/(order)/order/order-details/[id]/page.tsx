"use client";
import { Separator } from "@/components/ui/separator";
import useCancelOrderByUser from "@/hooks/api/transaction/useCancelOrderByUser";
import useGetUserOrder from "@/hooks/api/transaction/useGetUserOrder";
import { format } from "date-fns";
import OrderStatusBadge from "../../components/OrderStatusBadge";
import CancelOrderDialog from "./components/CancelOrderDialog";
import ProductDetailsCard from "./components/ProductDetailsCard";
import useFinishOrderByUser from "@/hooks/api/transaction/useFinishOrderByUser";
import FinishOrderDialog from "./components/FinishOrderDialog";

const OrderDetails = ({ params }: { params: { id: string } }) => {
  const { order, isLoading: isLoadingOrder, refetch: refetchOrder } = useGetUserOrder({
    orderId: Number(params.id),
  });
  console.log("in order dari FE",order);
  const {cancelOrderByUser} = useCancelOrderByUser()
  const{finishOrderByUser}= useFinishOrderByUser()
  const handleCancelOrder = async()=>{
    await cancelOrderByUser(order?.id)
    refetchOrder()
  }
  const handleFinishOrder = async()=>{
    await finishOrderByUser(order?.id)
    refetchOrder()
  }
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  return isLoadingOrder || !order ? (
    <p className="">Loading...</p>
  ) : (
    <main>
      <div className="flex flex-col gap-y-2 p-4 text-xs">
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            Order Status: <OrderStatusBadge orderStatus={order.status} />
          </div>
          <p className="text-xs text-orange-400 hover:cursor-pointer">
            See Details
          </p>
        </div>
        <Separator className="" />
        <div className="flex items-center justify-between">
          <div>Payment detail </div>
          <div>see details</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="font-light">Purchase Date</div>
          {/* <div>{format(order.createdAt, "dd MMMM yyyy, HH:mm")} WIB</div> */}
        </div>
      </div>
      <Separator className="h-1" />
      <div className="flex flex-col gap-y-2 p-4 text-xs">
        <div className="flex items-center justify-between text-base">
          <p className="font-semibold">Product Details</p>
          <p className="text-xs text-orange-400 hover:cursor-pointer">
            {order.stores.name}, {order.stores.City.citName}
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <ProductDetailsCard
            orderId={order?.id}
            orderItems={order?.OrderItems}
            purchaseTotal={order?.totalAmount}
            url={baseURL}
          />
        </div>
      </div>
      <Separator className="h-1" />
      <div>Delivery Details</div>
      <Separator className="h-1" />
      <div>Payment Details</div>

      <div className="flex justify-center gap-x-4">
        <CancelOrderDialog order={order} handleDelete={handleCancelOrder}/>
        <FinishOrderDialog order={order} handleFinish={handleFinishOrder}/>
      </div>
    </main>
  );
};

export default OrderDetails;
