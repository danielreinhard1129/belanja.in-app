"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetUserAddress from "@/hooks/api/address/useGetUserAddress";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import useGetDeliveryFee from "@/hooks/api/transaction/useGetDeliveryFee";
import { useAppSelector } from "@/redux/hooks";
import { ICart, IProductArg, PaymentMethodArgs } from "@/types/order.type";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import AddressSheet from "./components/AddressSheet";
import DiscountSheet from "./components/DiscountSheet";
import OrderSummarySheet from "./components/OrderSummarySheet";
import SelectedItemComponent from "./components/SelectedItemComponent";
import ShippingComponent from "./components/ShippingComponent";
import SkeletonShippingMethod from "./components/SkeletonShippingMethod";
import { calculateTotalWeight } from "@/helper/calculateTotalWeight";
import useCreateNewOrder from "@/hooks/api/transaction/useCreateNewOrder";
import Link from "next/link";
import PaymentMethodSheet from "./components/PaymentMethodSheet";
import useGetDiscountsByUser from "@/hooks/api/discounts/useGetDiscountsByUser";

const Checkout = () => {
  const [openAddressDrawer, setOpenAddressDrawer] = useState<boolean>(false);
  const [openDiscountDrawer, setOpenDiscountDrawer] = useState<boolean>(false);
  const [openPaymentMethodDrawer, setOpenPaymentMethodDrawer] =
    useState<boolean>(false);
  const [openShippingDrawer, setOpenShippingDrawer] = useState<boolean>(false);
  const [openCourierDrawer, setOpenCourierDrawer] = useState<boolean>(false);
  const [openOrderSummaryDrawer, setOpenOrderSummaryDrawer] =
    useState<boolean>(false);

  const [paymentMethodState, setPaymentMethodState] =
    useState<PaymentMethodArgs>(PaymentMethodArgs.DIGITAL_PAYMENT);

  const { id: userId } = useAppSelector((state) => state.user);
  const { carts } = useGetCartsById(userId);
  const { addresses, setAddresses } = useGetUserAddress(userId);
  const totalWeight = calculateTotalWeight(carts);
  const selectedAddress = addresses.length
    ? addresses.find((address) => address.isSelected)
    : null;

  const productIds = carts.map((product) => product.productId);

  const {
    discounts,
    isLoading: isLoadingDiscounts,
    refetch: refetchDiscounts,
    setDiscounts
  } = useGetDiscountsByUser({
    storeId: carts[0]?.storeId,
    productIds,
  });

  const { createNewOrder } = useCreateNewOrder();

  const {
    data: shippingMethods,
    setData: setShippingMethod,
    isLoading: isLoadingShipmentFetch,
    refetch: refetchDeliveryFee,
  } = useGetDeliveryFee({
    weight: totalWeight.toString(),
    destination: selectedAddress?.cityId.toString() || "",
    origin: carts[0]?.stores.cityId,
  });

  const selectedShipping = shippingMethods.length
    ? shippingMethods.find((method) => method.isSelected)
    : undefined;

  const selectedMethod = selectedShipping
    ? selectedShipping.costs.find((cost) => cost.isSelected)
    : undefined;

  const deliveryFee = selectedMethod && selectedMethod.cost[0].value;
  const handleCreateOrder = (cartItems: ICart[]) => {
    const products: IProductArg[] = cartItems.map((item) => ({
      productId: item.productId,
      qty: item.qty,
    }));
    createNewOrder({
      products: products,
      userId,
      storeId: carts[0].storeId,
      deliveryFee: String(deliveryFee),
      discountIds: discounts.filter(v=>v.isSelected === true).map(m=>m.id),
      addressId: selectedAddress?.id!,
      paymentMethod: paymentMethodState,
      deliveryCourier: selectedShipping?.name,
      deliveryService: selectedMethod?.description,
    });
  };

  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  console.log(paymentMethodState);

  if (!carts || !carts.length) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-y-2 text-2xl font-semibold">
        <p>Oops, Sorry. It seems you have no item selected.</p>
        <Link href="/">
          <p className="text-lg text-orange-300 underline">Start shopping?</p>
        </Link>
      </div>
    );
  }

  

  return (
    <main className="mx-auto md:container">
      <Separator className="h-1 md:hidden" />
      <section className="flex flex-col gap-2 bg-white p-4">
        <h6 className="text-md font-bold">Items selected</h6>
        <div className="mb-2">
          <p className="text-sm font-semibold">{carts[0].stores.name}</p>
          <p className="text-sm font-light">{carts[0].stores.City.citName}</p>
        </div>
        {carts.map((cart, index) => (
          <SelectedItemComponent
            key={index}
            index={index}
            cart={cart}
            url={baseURL}
          />
        ))}
        <Link href={`/cart`}>
          <p className="text-orange-400 underline">Edit items?</p>
        </Link>
      </section>

      <Separator className="h-1" />
      <section className="flex flex-col gap-2 bg-gradient-to-b from-white from-30% to-orange-50 p-4">
        <h6 className="text-md font-bold">Payment and delivery</h6>
        <div className="rounded-md bg-white py-2 shadow-[0px_1px_4px_0px_#D6DFEB]">
          <div
            className="flex cursor-pointer items-center justify-between gap-y-1 px-4 pb-2 pt-1"
            onClick={() => setOpenAddressDrawer(true)}
          >
            {addresses.map((address, index) => {
              return address.isSelected ? (
                <div key={index} className="w-64">
                  <div className="flex items-center gap-2">
                    {address.isPrimary ? (
                      <Badge
                        variant="outline"
                        className="flex w-[56px] justify-center rounded-sm bg-zinc-300 px-0.5 py-0.5 align-middle text-xs text-zinc-600"
                      >
                        <p>Primary</p>
                      </Badge>
                    ) : null}
                    <p className="text-sm font-semibold">{address.user.name}</p>
                  </div>
                  <div className="line-clamp-1 overflow-hidden">
                    <p className="text-sm font-light">{address.addressLine}</p>
                  </div>
                </div>
              ) : null;
            })}
            <div className="flex justify-end">
              <ChevronRight className="max-h-4 max-w-4 font-light" />
            </div>
          </div>
          <AddressSheet
            openState={openAddressDrawer}
            setOpenState={setOpenAddressDrawer}
            addresses={addresses}
            closeDrawer={setAddresses}
            refetch={refetchDeliveryFee}
          />
          <Separator className="h-0.5" />
          {isLoadingShipmentFetch == true || shippingMethods.length == 0 ? (
            <SkeletonShippingMethod />
          ) : (
            shippingMethods.map((shippingMethod) => {
              return shippingMethod.isSelected
                ? shippingMethod.costs.map((cost, index) => {
                    return cost.isSelected ? (
                      <ShippingComponent
                        index={index}
                        cost={cost}
                        openCourierDrawer={openCourierDrawer}
                        openShippingDrawer={openShippingDrawer}
                        setOpenCourierDrawer={setOpenCourierDrawer}
                        setOpenShippingDrawer={setOpenShippingDrawer}
                        setShippingMethod={setShippingMethod}
                        shippingMethod={shippingMethod}
                        shippingMethods={shippingMethods}
                      />
                    ) : null;
                  })
                : null;
            })
          )}

          <Separator className="h-0.5" />
          <div
            className="flex items-center justify-between px-4 pt-2"
            onClick={() => setOpenPaymentMethodDrawer(true)}
          >
            <p>Payment method</p>
            <div className="flex justify-end">
              <ChevronRight className="max-h-4 max-w-4 font-light" />
            </div>
          </div>
          <PaymentMethodSheet
            openState={openPaymentMethodDrawer}
            setOpenState={setOpenPaymentMethodDrawer}
            radioValue={paymentMethodState}
            setRadioValue={setPaymentMethodState}
          />
        </div>
      </section>
      <Separator className="h-1" />
      <div
        onClick={() => setOpenDiscountDrawer(true)}
        className="flex h-12 max-w-full items-center justify-between border-b border-t border-orange-300 bg-orange-100 px-5"
      >
        <p className="font-semibold">Use a promo?</p>
        <div className="mr-3 flex justify-end">
          <ChevronRight className="max-h-4 max-w-4 font-light" />
        </div>
      </div>
      <DiscountSheet
        discounts={discounts}
        openState={openDiscountDrawer}
        setOpenState={setOpenDiscountDrawer}
        closeDrawer={setDiscounts}
        refetch={refetchDiscounts}
      />
      <Separator className="h-1" />
      <section className="mb-0 grid grid-cols-2 bg-white p-4 pb-8">
        <div
          onClick={() => setOpenOrderSummaryDrawer(true)}
          className="flex flex-col align-top"
        >
          <p className="text-sm font-light">Total Bayar</p>
          <div className="flex w-32 max-w-36 items-center justify-between overflow-hidden">
            <p className="text-lg font-bold">Rp100.000</p>
            <ChevronDown className="max-h-4 max-w-4 font-light" />
          </div>
        </div>
        <OrderSummarySheet
          openState={openOrderSummaryDrawer}
          setOpenState={setOpenOrderSummaryDrawer}
        />
        <div className="flex items-center justify-center">
          <Button
            onClick={() => handleCreateOrder(carts)}
            className="flex h-[95%] w-[90%] items-center justify-center px-4 py-2 text-lg"
          >
            Bayar
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Checkout;
