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
import GridItem from "./components/GridItems";
import { Button } from "@/components/ui/button";
import { MIDTRANS_PUBLIC_CLIENT } from "@/utils/config";
import { useEffect, useState } from "react";
import { OrderStatus } from "@/types/order.type";
import UploadPaymentProofDialog from "./components/UploadPaymentProofDialog";
import PaymentProofDialog from "./components/PaymentProofDialog";
import { toast } from "sonner";

const OrderDetails = ({ params }: { params: { id: string } }) => {
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const [openProofDialog, setOpenProofDialog] = useState<boolean>(false);
  const {
    order,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
  } = useGetUserOrder({
    orderId: Number(params.id),
  });
  const { cancelOrderByUser } = useCancelOrderByUser();
  const { finishOrderByUser } = useFinishOrderByUser();
  const handleCancelOrder = async () => {
    await cancelOrderByUser(order?.id);
    refetchOrder();
  };
  const handleFinishOrder = async () => {
    await finishOrderByUser(order?.id);
    refetchOrder();
  };
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = MIDTRANS_PUBLIC_CLIENT;

    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey || "");
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      if (!isLoadingOrder && order) {
        if (window.snap) {
          window.snap.pay(`${order.Payment.snapToken}`, {
            onSuccess: function (result: any) {
              toast.success("Payment success!");
            },
            onPending: function (result: any) {
              toast("Waiting for your payment!");
            },
            onError: function (result: any) {
              toast.error("Payment failed!");
            },
            onClose: function () {
            },
          });
        } else {
          toast.error("Snap is not loaded yet. Please try again.");
        }
      }
    } catch (error) {
      toast.error("Payment Error!");
    }
  };

  return isLoadingOrder || !order ? (
    <p className="">Loading...</p>
  ) : (
    <main>
      <div className="flex flex-col gap-y-2 p-4 text-xs">
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            Order Status: <OrderStatusBadge orderStatus={order.status} />
          </div>
        </div>
        <div className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2 font-semibold">
            Order No:{" "}
            <span className="rounded-sm bg-orange-50 px-2 py-1">
              {order.orderNumber}
            </span>
          </div>
        </div>
        <Separator className="" />
        <div className="flex items-center justify-between">
          <div className="font-light">Purchase Date</div>
          <div>{format(order.createdAt, "dd MMMM yyyy, HH:mm")} WIB</div>
        </div>
      </div>
      <Separator className="h-1" />
      <div className="flex flex-col gap-y-2 p-4 text-xs">
        <div className="flex items-center justify-between text-base">
          <p className="font-semibold">Product Details</p>
          <p className="text-xs text-orange-400">
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
      <div className="p-4">
        <h4 className="font-semibold">Delivery Details</h4>
        <div className="grid w-full grid-cols-8 items-center gap-y-2 py-2 text-xs">
          <GridItem
            label="Delivery No."
            value={order.Delivery[0].deliveryNumber}
          />
          <GridItem
            label="Courier Service"
            value={order.Delivery[0].deliveryCourier}
          />
          <GridItem
            label="Shipping Method"
            value={order.Delivery[0].deliveryService}
          />
          <GridItem
            label="Address"
            value={`${order.Delivery[0].addresses.addressLine}, ${order.Delivery[0].addresses.subdistricts.subdistrictName}, ${order.Delivery[0].addresses.cities.citName}, ${order.Delivery[0].addresses.cities.province.provinceName}`}
          />
          <GridItem label="Delivery status" value={order.Delivery[0].status} />
        </div>
      </div>
      <Separator className="h-1" />
      <div className="p-4">
        <h4 className="font-semibold">Payment Details</h4>
        <div className="flex w-full flex-col gap-y-2 py-2 text-xs">
          <div className="flex items-center justify-between">
            <p>Payment ID</p>
            <p>{order.Payment.invoiceNumber}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Payment Method</p>
            <p>
              {!order.Payment.paymentMethod
                ? "Belum bayar"
                : order.Payment.paymentMethod}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p>Purchase Total</p>
            <p>{new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(order.totalAmount),
                ).toFixed().length,
              }).format(order.totalAmount)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Delivery fee</p>
            <p>{new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(order.Delivery[0].deliveryFee),
                ).toFixed().length,
              }).format(order.Delivery[0].deliveryFee)}</p>
          </div>

          {order.Payment.paymentMethod === "MANUAL_TRANSFER" ? (
            <div className="flex items-center justify-between">
              <p>Payment proof</p>
              <p>
                {!order.Payment.paymentProof ? (
                  "No payment proof found"
                ) : (
                  <p
                    className="cursor-pointer text-orange-400 underline"
                    onClick={() => setOpenProofDialog(true)}
                  >
                    See payment proof
                  </p>
                )}
              </p>
              <PaymentProofDialog
                open={openProofDialog}
                setOpen={setOpenProofDialog}
                order={order}
              />
            </div>
          ) : null}
          <Separator />
          <div className="flex items-center justify-between text-lg font-semibold">
            <p>Total</p>
            <p>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(Number(order.Delivery[0].deliveryFee + order.totalAmount)),
                ).toFixed().length,
              }).format(Number(order.Delivery[0].deliveryFee + order.totalAmount))}
            </p>
          </div>
        </div>
      </div>
      <Separator className="h-1" />
      <div className="p-4">
        {order.Payment.paymentMethod === "MANUAL_TRANSFER" ? (
          <Button
            className="w-full px-4 py-2"
            disabled={order.status !== OrderStatus.WAITING_FOR_PAYMENT}
            onClick={() => setOpenUploadDialog(true)}
          >
            Upload Payment Proof
          </Button>
        ) : !order.Payment.paymentMethod ? (
          <Button
            className="w-full px-4 py-2"
            onClick={handlePayment}
            disabled={order.status !== OrderStatus.WAITING_FOR_PAYMENT}
          >
            Pay
          </Button>
        ) : null}
        <UploadPaymentProofDialog
          order={order}
          refetchOrder={refetchOrder}
          openState={openUploadDialog}
          setOpenState={setOpenUploadDialog}
        />
      </div>
      <Separator className="mb-4 h-1" />

      <div className="flex justify-center gap-x-4 pb-4">
        <CancelOrderDialog order={order} handleDelete={handleCancelOrder} />
        <FinishOrderDialog order={order} handleFinish={handleFinishOrder} />
      </div>
    </main>
  );
};

export default OrderDetails;
