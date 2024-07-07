import React, { Dispatch, FC, SetStateAction } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { OrderStatus } from '@/types/order.type';

interface StatusSelectProps {
    setValueStatus: Dispatch<SetStateAction<OrderStatus | null>>
}

const StatusSelect:FC<StatusSelectProps>= ({setValueStatus}) => {
    const handleSelectStatus = (e: string) => {
        if (e === "none") {
            setValueStatus(null);
        } else {
            setValueStatus(e as OrderStatus);
        }
      };
  return (
    <Select onValueChange={(value) => handleSelectStatus(value)}>
          <SelectTrigger className=" w-fit px-4 items-center">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent
            ref={(ref) =>
              // temporary workaround from https://github.com/shadcn-ui/ui/issues/1220
              ref?.addEventListener("touchend", (e) => e.preventDefault())
            }
          >
            <SelectGroup>
              <SelectLabel>Order Status</SelectLabel>
              <SelectItem value="none">All Order Status</SelectItem>
              <SelectItem value="WAITING_FOR_PAYMENT">
                Waiting for payment
              </SelectItem>
              <SelectItem value="WAITING_ADMIN_CONFIRMATION">
                Waiting for Confirmation
              </SelectItem>
              <SelectItem value="ORDER_PROCESSED">In Packing</SelectItem>
              <SelectItem value="ORDER_SHIPPED">In Delivery</SelectItem>
              <SelectItem value="ORDER_RECEIVED">
                Successfuly Delivered
              </SelectItem>
              <SelectItem value="ORDER_CANCELLED">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
  )
}

export default StatusSelect