import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardPlus, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import {
  CreateStore,
  createStore,
  defaultValues,
} from "./validationSchema/createDiscount";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import useGetProducts from "@/hooks/api/product/useGetProducts";

interface DialogCreateDiscountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogCreateDiscount: React.FC<DialogCreateDiscountProps> = ({
  onOpenChange,
  open,
  refetch,
}) => {
  const { products } = useGetProducts();
  const methods = useForm<CreateStore>({
    mode: "all",
    resolver: zodResolver(createStore),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  const productsOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
  }));

  const discountTypeOptions = [
    {
      value: "BOGO",
      label: "BOGO",
    },
    { value: "PRODUCT", label: "PRODUCT" },
    { value: "MIN_PURCHASE", label: "MIN_PURCHASE" },
  ];

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit: SubmitHandler<CreateStore> = async (data) => {
    console.log(data);
    // await createStore(data);
    // refetch();
    // reset(defaultValues);
    // setIsOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="mt-1 flex cursor-pointer items-center gap-2">
          <ClipboardPlus />
          Discount
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Discount</DialogTitle>
              <DialogDescription>
                Create a new discount to your products
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <FormInput<CreateStore>
                name="title"
                label="Title"
                type="text"
                placeholder="Title"
              />
              <FormInput<CreateStore>
                name="desc"
                label="Description"
                type="text"
                placeholder="Description"
              />
              <FormSelect<CreateStore>
                name="discountType"
                label="Discount Type"
                datas={discountTypeOptions}
              />
              <FormSelect<CreateStore>
                name="productId"
                label="Product"
                datas={productsOptions}
              />
              <div className="flex justify-between gap-10">
                <FormInput<CreateStore>
                  name="discountValue"
                  label="Discount Value"
                  type="number"
                  placeholder=""
                />
                <FormInput<CreateStore>
                  name="minPurchase"
                  label="Minimal Purchase"
                  type="number"
                  placeholder=""
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={handleReset}
                className="px-4 py-2"
              >
                Reset
              </Button>
              {/* <Button disabled={isLoading} type="submit" className="px-4 py-2">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Loading" : "Add"}
            </Button> */}
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateDiscount;
