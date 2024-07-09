"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/navigation'
import React from 'react'

const CartFooter = () => {
  const {  cartCounter:cartsCount } = useAppSelector((state) => state.user);

    const router  = useRouter()


   
  return (
    <div className="fixed bottom-0 w-full py-4 flex flex-col items-center z-50 bg-white border-t-2">
        <div className="w-full flex justify-end">
          <Button disabled={!cartsCount} className="w-48 px-4 py-2 mr-4" onClick={()=>router.push('/checkout')}>Checkout</Button>
        </div>
      </div>
  )
}

export default CartFooter