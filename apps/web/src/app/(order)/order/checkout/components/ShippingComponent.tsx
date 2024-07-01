import { CourierService, ServiceCost } from "@/types/rajaongkir-response.type";
import { ChevronRight } from "lucide-react";
import React, { Dispatch, FC, SetStateAction } from "react";
import ShippingMethodSheet from "./ShippingMethodSheet";
import CourierSheet from "./CourierSheet";

interface ShippingComponentProps {
  index: number;
  cost: ServiceCost;
  openShippingDrawer: boolean;
  openCourierDrawer: boolean;
  shippingMethod: CourierService;
  shippingMethods: CourierService[];
  setOpenShippingDrawer: Dispatch<SetStateAction<boolean>>;
  setOpenCourierDrawer: Dispatch<SetStateAction<boolean>>;
  setShippingMethod: Dispatch<SetStateAction<CourierService[]>>;
}

const ShippingComponent: FC<ShippingComponentProps> = ({
  cost,
  index,
  openCourierDrawer,
  openShippingDrawer,
  setOpenShippingDrawer,
  setOpenCourierDrawer,
  shippingMethod,
  shippingMethods,
  setShippingMethod,
}) => {
  return (
    <div key={index} className="flex flex-col gap-y-2 px-4 py-2 text-sm">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={() => setOpenShippingDrawer(true)}
      >
        <p className="font-bold">Pengiriman {cost.service}</p>
        <div className="flex justify-end">
          <ChevronRight className="max-h-4 max-w-4 font-light" />
        </div>
      </div>
      <ShippingMethodSheet
        openState={openShippingDrawer}
        setOpenState={setOpenShippingDrawer}
        shippingMethods={shippingMethods}
        closeDrawer={setShippingMethod}
      />
      <div
        className="flex items-center justify-between"
        onClick={() => setOpenCourierDrawer(true)}
      >
        <div className="flex flex-col">
          <div>
            {shippingMethod?.name}{" "}
            <span>
              (
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: Math.trunc(
                  Math.abs(cost.cost[0].value || 0),
                ).toFixed().length,
              }).format(cost.cost[0].value || 0)}
              )
            </span>
          </div>
          <div className="font-light">
            Estimated arrival in {cost.cost[0].etd || ""} days.
          </div>
        </div>
        <div className="flex justify-end">
          <ChevronRight className="max-h-4 max-w-4 font-light" />
        </div>
      </div>
      <CourierSheet
        openState={openCourierDrawer}
        setOpenState={setOpenCourierDrawer}
        shippingMethods={shippingMethods}
        closeDrawer={setShippingMethod}
      />
    </div>
  );
};

export default ShippingComponent;
