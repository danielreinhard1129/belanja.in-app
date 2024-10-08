import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardPlus, Loader2 } from "lucide-react";
import React from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";

import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import useCreateDiscount from "@/hooks/api/discounts/useCreateDiscount";
import useGetProducts from "@/hooks/api/product/useGetProducts";
import useGetStores from "@/hooks/api/store/useGetStores";
import { toast } from "sonner";
import {
  CreateStore,
  createStore,
  defaultValues,
} from "./validationSchema/createDiscountSuperAdmin";

interface DialogCreateDiscountSuperAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogCreateDiscountSuperAdmin: React.FC<
  DialogCreateDiscountSuperAdminProps
> = ({ onOpenChange, open, refetch }) => {
  const { createDiscount, isLoading } = useCreateDiscount();
  const { products } = useGetProducts();
  const { stores } = useGetStores();
  const methods = useForm<CreateStore>({
    mode: "all",
    resolver: zodResolver(createStore),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  const productsOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
  }));

  const storesOptions = stores.map((store) => ({
    value: store.id.toString(),
    label: store.name,
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
    try {
      await createDiscount(data);
      refetch();
      reset(defaultValues);
      onOpenChange(false);
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-[#ff6100] px-4 py-2 text-sm font-medium text-white">
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
                name="storeId"
                label="Store"
                datas={storesOptions}
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
                  name="discountvalue"
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
              <FormInput<CreateStore>
                name="discountLimit"
                label="Discount Limit"
                type="number"
                placeholder=""
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="px-4 py-2"
              >
                Reset
              </Button>
              <Button
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateDiscountSuperAdmin;
