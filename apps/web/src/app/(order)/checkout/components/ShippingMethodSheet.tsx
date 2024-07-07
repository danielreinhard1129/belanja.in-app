import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CourierService } from "@/types/rajaongkir-response.type";
import { CheckCircle } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

interface ShippingMethodSheetProps {
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
  shippingMethods: CourierService[] | null;
  closeDrawer: (shippingMethods: CourierService[]) => void;
}

const ShippingMethodSheet: FC<ShippingMethodSheetProps> = ({
  openState,
  setOpenState,
  shippingMethods,
  closeDrawer,
}) => {
  const handleSelectShippingMethod = (index: number) => {
    if (shippingMethods) {
      const data = shippingMethods.map((method, idx) => {
        if (method.isSelected) {
          const deliveryFee = method.costs.map((cost, id) => {
            return { ...cost, isSelected: id == index };
          });
          return { ...method, costs: deliveryFee };
        }
        return method;
      });
      closeDrawer(data);
      setOpenState(false);
    }
  };

  return (
    <Sheet open={openState} onOpenChange={setOpenState} >
      <SheetContent side={"bottom"} className="flex flex-col overflow-y-scroll rounded-t-sm">
        <SheetHeader>
          <SheetTitle>Shipping Method</SheetTitle>
        </SheetHeader>
        {shippingMethods?.map((shippingMethod) => {
          return shippingMethod.isSelected
            ? shippingMethod?.costs.map((cost, index) => {
                return (
                  <div className="flex flex-col transition-all duration-200" key={index}>
                    <div className="flex items-center justify-between hover:bg-gray-100">
                      <div
                        
                        className="flex h-20 flex-col justify-center rounded-sm px-1 "
                        onClick={() => handleSelectShippingMethod(index)}
                      >
                        <div className="text-lg font-semibold">
                          {cost.description} ({cost.service})
                        </div>
                        <div className="">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumSignificantDigits: Math.trunc(
                              Math.abs(cost.cost[0].value),
                            ).toFixed().length,
                          }).format(cost.cost[0].value)}
                        </div>
                        <div>Estimasi pengiriman {cost.cost[0].etd} hari</div>
                      </div>
                      {cost.isSelected ? <CheckCircle /> : null}
                    </div>
                    {shippingMethod.costs.length - 1 !== index ? (
                      <Separator className="mt-4 h-0.5" />
                    ) : null}
                  </div>
                );
              })
            : null;
        })}
      </SheetContent>
    </Sheet>
  );
};

export default ShippingMethodSheet;
