"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import React from 'react'

const CartFooter = () => {
    const router  = useRouter()
  return (
    <div className="fixed bottom-0 w-full py-4 flex flex-col items-center z-50">
        <Separator className="h-1 my-2" />
        <div className="w-full flex justify-end">
          <Button className="w-48 px-4 py-2 mr-4" onClick={()=>router.push('/checkout')}>Checkout</Button>
        </div>
      </div>
  )
}

export default CartFooter