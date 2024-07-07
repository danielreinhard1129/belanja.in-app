import OrderStatusBadge from "@/app/(order)/components/OrderStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder } from "@/types/order.type";
import { format } from "date-fns";
import Image from "next/image";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import ConfirmPaymentDialog from "./ConfirmPaymentDialog";
import RejectPaymentDialog from "./RejectPaymentDialog";

interface OrderDetailDialogProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  setOrderId: Dispatch<SetStateAction<number | undefined>>;
  order: IOrder | null;
  isLoadingOrder: boolean;
  setOrder: Dispatch<SetStateAction<IOrder | null>>;
  openConfirmDialog: boolean;
  setOpenConfirmDialog: Dispatch<SetStateAction<boolean>>;
  handleConfirm: () => void;
  openRejectDialog: boolean;
  setOpenRejectDialog: Dispatch<SetStateAction<boolean>>;
  handleReject: () => void;
}

const GridItem = ({ label, value }: { label: string; value: ReactNode }) => (
  <>
    <div className="col-span-3 font-semibold">{label}</div>
    <div className="col-span-1 text-center">:</div>
    <div className="col-span-6">{value}</div>
  </>
);

const OrderDetailDialog: FC<OrderDetailDialogProps> = ({
  openState,
  setOpenState,
  setOrderId,
  order,
  isLoadingOrder,
  setOrder,
  openConfirmDialog,
  setOpenConfirmDialog,
  handleConfirm,
  handleReject,
  openRejectDialog,
  setOpenRejectDialog,
}) => {
  const handleOpenState = async (open: boolean) => {
    await new Promise<void>((res) => setTimeout(res, 250));
    setOpenState(open);
    setOrder(null);
  };

  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  return (
    <Dialog open={openState} onOpenChange={handleOpenState}>
      <DialogContent className="min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isLoadingOrder || !order || !order.id ? (
          <div className="flex justify-center py-20 font-semibold">
            Loading...
          </div>
        ) : (
          <div className="grid w-full grid-cols-10">
            <GridItem label="Order ID" value={order?.orderNumber} />
            <GridItem
              label="Total Order"
              value={new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(order?.totalAmount),
                ).toFixed().length,
              }).format(order?.totalAmount)}
            />
            <GridItem
              label="Delivery Fee"
              value={new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(order?.Delivery[0].deliveryFee),
                ).toFixed().length,
              }).format(order?.Delivery[0].deliveryFee)}
            />
            <GridItem
              label="Payment Total"
              value={new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(order?.Payment.amount),
                ).toFixed().length,
              }).format(order?.Payment.amount)}
            />
            <GridItem
              label="Payment Status"
              value={order?.Payment.paymentStatus}
            />
            <GridItem
              label="Purchase Date"
              value={format(order?.createdAt, "dd MMMM yyyy")}
            />
            <GridItem
              label="Order Status"
              value={
                <div className="w-fit">
                  <OrderStatusBadge orderStatus={order.status} />
                </div>
              }
            />
            <GridItem
              label="Payment proof"
              value={
                !order.Payment?.paymentProof ? (
                  <div>No payment proof found</div>
                ) : (
                  <div className="relative h-[400px] w-full rounded-sm border">
                    <Image
                      alt="paymentProof"
                      fill
                      src={`${baseURL}/assets${order.Payment?.paymentProof}`}
                      className="object-cover"
                    />
                  </div>
                )
              }
            />
            <div className="mt-4 flex justify-start gap-x-4">
              <ConfirmPaymentDialog
                handleConfirm={handleConfirm}
                openConfirmDialog={openConfirmDialog}
                order={order}
                setOpenConfirmDialog={setOpenConfirmDialog}
              />
              <RejectPaymentDialog
                handleReject={handleReject}
                openRejectDialog={openRejectDialog}
                order={order}
                setOpenRejectDialog={setOpenRejectDialog}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
