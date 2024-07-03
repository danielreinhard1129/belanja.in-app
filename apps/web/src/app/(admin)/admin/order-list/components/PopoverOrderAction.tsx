import React, { Dispatch, FC, SetStateAction } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ban, Eye, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IOrder, OrderStatus } from "@/types/order.type";

interface PopoverOrderActionProps {
  order: IOrder;
  handleOpenDetailsDialog: (orderId: number) => void;
  handleOpenCancelDialog: (orderId: number) => void;
  handleOpenSendOrderDialog: (orderId: number)=>void
}

const PopoverOrderAction: FC<PopoverOrderActionProps> = ({
  order,
  handleOpenDetailsDialog,
  handleOpenCancelDialog,
  handleOpenSendOrderDialog
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <MoreHorizontal className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-fit text-xs">
        <div className="mb-2 text-center font-bold">Action</div>
        <div className="flex flex-col items-start">
          <Button
            className="space-x-1 rounded-sm px-2 py-1 text-xs hover:bg-gray-100"
            variant={"ghost"}
            onClick={() => handleOpenDetailsDialog(order.id)}
          >
            <Eye size={16} /> <p>View Detail</p>
          </Button>
          <Button
            className="space-x-1 rounded-sm px-2 py-1 text-xs text-green-600 hover:bg-gray-100 hover:text-green-800"
            variant={"ghost"}
            disabled={order.status !== OrderStatus.ORDER_PROCESSED}
            onClick={() => handleOpenSendOrderDialog(order.id)}

          >
            <Send size={16} />
            <p>Send Order</p>
          </Button>
          <Button
            className="space-x-1 rounded-sm px-2 py-1 text-xs text-red-600 hover:bg-gray-100 hover:text-red-800"
            variant={"ghost"}
            disabled={
              order.status === OrderStatus.ORDER_SHIPPED ||
              order.status === OrderStatus.ORDER_RECEIVED ||
              order.status === OrderStatus.ORDER_CANCELLED
            }
            onClick={() => handleOpenCancelDialog(order.id)}
          >
            <Ban size={16} />
            <p>Cancel Order</p>
          </Button>
          
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverOrderAction;
