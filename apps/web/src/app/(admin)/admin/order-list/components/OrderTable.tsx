import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EllipsisIcon } from "lucide-react";
import { IOrder } from "@/types/order.type";
import OrderStatusBadge from "@/app/(order)/order/components/OrderStatusBadge";
import OrderDetailDialog from "./OrderDetailDialog";
import Pagination from "@/components/Pagination";
import { IPaginationMeta } from "@/types/pagination.type";
import PopoverOrderAction from "./PopoverOrderAction";
import CancelOrderDialog from "./CancelOrderDialog";
import useCancelOrderByAdmin from "@/hooks/api/transaction/useCancelOrderByAdmin";
import SendOrderDialog from "./SendOrderDialog";
import useSendOrderByAdmin from "@/hooks/api/transaction/useSendOrderByAdmin";
import useConfirmPayment from "@/hooks/api/transaction/useConfirmPayment";

interface OrderTableProps {
  orders: IOrder[];
  order: IOrder | null;
  openState: boolean;
  isLoadingOrders: boolean;
  isLoadingOrder: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  setOrderId: Dispatch<SetStateAction<number | undefined>>;
  orderId: number | undefined;
  setOrder: Dispatch<SetStateAction<IOrder | null>>;
  ordersMeta: IPaginationMeta | null;
  handleChangePaginate: ({ selected }: { selected: number }) => void;
  refetchOrder: () => void;
  refetchOrders: () => void;
}

const OrderTable: FC<OrderTableProps> = ({
  orders,
  order,
  isLoadingOrders,
  setOpenState,
  openState,
  setOrderId,
  orderId,
  isLoadingOrder,
  setOrder,
  handleChangePaginate,
  ordersMeta,
  refetchOrder,
  refetchOrders,
}) => {
  const [openCancelDialog, setOpenCancelDialog] = useState<boolean>(false);
  const [openSendDialog, setOpenSendDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false);
  const { cancelOrderByAdmin } = useCancelOrderByAdmin();
  const { sendOrderByAdmin } = useSendOrderByAdmin();
  const {confirmPayment} = useConfirmPayment()

  console.log("ini orderID", orderId);
  //
  const handleOpenDetailsDialog = (orderId: number) => {
    setOrderId(orderId);
    setOpenState(true);
  };
  const handleOpenCancelDialog = (orderId: number) => {
    setOrderId(orderId);
    setOpenCancelDialog(true);
  };
  const handleOpenSendDialog = (orderId: number) => {
    setOrderId(orderId);
    setOpenSendDialog(true);
  };

  const handleCancelOrder = async (orderId: number | undefined) => {
    await cancelOrderByAdmin(orderId);
    refetchOrder()
    refetchOrders();
  };
  const handleSendOrder = async (orderId: number | undefined) => {
    await sendOrderByAdmin(orderId);
    refetchOrders();
  };
  const handleConfirmPayment = async (orderId: number | undefined) => {
    await confirmPayment(orderId)

    refetchOrder();
    refetchOrders()
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="font-semibold">
          <TableHead className="w-[100px]">Order No.</TableHead>
          <TableHead>Buyer</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead className="text-center">Amount</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoadingOrders ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-xs">
              Loading...
            </TableCell>
          </TableRow>
        ) : !orders.length ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-xs">
              Data not found
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order, i) => {
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.users?.name}</TableCell>
                <TableCell>{order.Payment?.paymentMethod}</TableCell>
                <TableCell className="text-center">
                  {order.totalAmount}
                </TableCell>
                <TableCell className="w-fit">
                  <OrderStatusBadge orderStatus={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <PopoverOrderAction
                    order={order}
                    handleOpenDetailsDialog={handleOpenDetailsDialog}
                    handleOpenCancelDialog={handleOpenCancelDialog}
                    handleOpenSendOrderDialog={handleOpenSendDialog}
                  />
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
      <OrderDetailDialog
        openState={openState}
        setOpenState={setOpenState}
        setOrderId={setOrderId}
        order={order}
        isLoadingOrder={isLoadingOrder}
        setOrder={setOrder}
        handleConfirm={()=>handleConfirmPayment(orderId)}
        openConfirmDialog={openConfirmDialog}
        setOpenConfirmDialog={setOpenConfirmDialog}
        handleReject={()=>handleCancelOrder(orderId)}
        openRejectDialog={openRejectDialog}
        setOpenRejectDialog={setOpenRejectDialog}
      />
      <CancelOrderDialog
        order={order}
        handleDelete={() => handleCancelOrder(orderId)}
        openCancelDialog={openCancelDialog}
        setOpenCancelDialog={setOpenCancelDialog}
      />
      <SendOrderDialog
        handleSend={()=>handleSendOrder(orderId)}
        openSendDialog={openSendDialog}
        setOpenSendDialog={setOpenSendDialog}
      />
      <div className="mb-4 flex justify-center">
        <Pagination
          total={ordersMeta?.total || 0}
          take={ordersMeta?.take || 0}
          onChangePage={handleChangePaginate}
        />
      </div>
    </Table>
  );
};

export default OrderTable;
