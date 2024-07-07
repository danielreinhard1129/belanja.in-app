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
  shippingMethods: CourierService[];

  closeDrawer: (shippingMethods: CourierService[]) => void;
}

const CourierSheet: FC<ShippingMethodSheetProps> = ({
  openState,
  setOpenState,
  shippingMethods,
  closeDrawer,
}) => {
  const handleSelectCourier = (index: number) => {
    closeDrawer(
      shippingMethods.map((val, idx) => {
        return { ...val, isSelected: idx == index };
      }),
    );
    setOpenState(false);
  };

  return (
    <Sheet open={openState} onOpenChange={setOpenState}>
      <SheetContent side={"bottom"} className="flex flex-col overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Select Courier</SheetTitle>
        </SheetHeader>
        {shippingMethods?.map((method, methodIndex) => {
          return (
            <div className="flex flex-col transition-all duration-200" key={methodIndex}>
              <div className="flex items-center justify-between hover:bg-gray-100 ">
                <div
                  
                  className="flex h-20 flex-col justify-center rounded-sm px-1 "
                  onClick={() => handleSelectCourier(methodIndex)}
                >
                  {method.costs.map((cost, costIndex) => {
                    return cost.isSelected ? (
                      <div key={costIndex}>
                        <div className="text-lg font-semibold">
                          {method.name} ({method.code})
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
                    ) : null;
                  })}
                </div>
                {method.isSelected ? <CheckCircle /> : null}
              </div>
              {shippingMethods.length - 1 !== methodIndex ? (
                <Separator className="mt-4 h-0.5" />
              ) : null}
            </div>
          );
        })}
      </SheetContent>
    </Sheet>
  );
};

export default CourierSheet;
