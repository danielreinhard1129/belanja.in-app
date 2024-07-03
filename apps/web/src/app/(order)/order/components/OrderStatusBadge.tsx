import { Badge } from '@/components/ui/badge'
import React, { FC } from 'react'



const OrderStatusBadge:FC<{orderStatus: string}> = ({orderStatus}) => {
  return (
    <div className="mr-1">
            {orderStatus == "WAITING_FOR_PAYMENT" ? (
              <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-amber-100 px-1 py-0.5 align-middle text-xs text-amber-600 border-none`}
              >
                <p>Waiting for payment</p>
              </Badge>
            ) : orderStatus == "WAITING_ADMIN_CONFIRMATION" ? (
                <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-orange-100 px-1 py-0.5 align-middle text-xs text-orange-600 border-none`}
              >
                <p>Waiting for approval</p>
              </Badge>
            ) : orderStatus == "ORDER_CANCELLED" ? (
                <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-red-100 px-1 py-0.5 align-middle text-xs text-red-600 border-none`}
              >
                <p>Order has been cancelled</p>
              </Badge>
            ) : orderStatus == "ORDER_PROCESSED" ? (
                <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-teal-100 px-1 py-0.5 align-middle text-xs  text-teal-600 border-none`}
              >
                <p>In packing</p>
              </Badge>
            ) : orderStatus == "ORDER_SHIPPED" ? (
                <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-teal-100 px-1 py-0.5 align-middle text-xs  text-teal-600 border-none`}
              >
                <p>In delivery</p>
              </Badge>
            ) : orderStatus == "ORDER_RECEIVED" ? (
                <Badge
                variant="outline"
                className={`flex min-w-[56px] justify-center rounded-sm bg-green-100 px-1 py-0.5 align-middle text-xs text-green-600 border-none`}
              >
                <p>Sucessfully delivered</p>
              </Badge>
            ): (
             <></>
            )}
          </div>
  )
}

export default OrderStatusBadge




