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
import { toast } from "sonner";
import {
  defaultValues,
  SchemaDiscount,
  schemaDiscount,
} from "./validationSchema/schemaDiscount";

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
  const { createDiscount, isLoading } = useCreateDiscount();
  const { products } = useGetProducts();
  const methods = useForm<SchemaDiscount>({
    mode: "all",
    resolver: zodResolver(schemaDiscount),
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

  const onSubmit: SubmitHandler<SchemaDiscount> = async (data) => {
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
              <FormInput<SchemaDiscount>
                name="title"
                label="Title"
                type="text"
                placeholder="Title"
              />
              <FormInput<SchemaDiscount>
                name="desc"
                label="Description"
                type="text"
                placeholder="Description"
              />
              <FormSelect<SchemaDiscount>
                name="discountType"
                label="Discount Type"
                datas={discountTypeOptions}
              />
              <FormSelect<SchemaDiscount>
                name="productId"
                label="Product"
                datas={productsOptions}
              />
              <div className="flex justify-between gap-10">
                <FormInput<SchemaDiscount>
                  name="discountvalue"
                  label="Discount Value"
                  type="number"
                  placeholder=""
                />
                <FormInput<SchemaDiscount>
                  name="minPurchase"
                  label="Minimal Purchase"
                  type="number"
                  placeholder=""
                />
              </div>
              <FormInput<SchemaDiscount>
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

export default DialogCreateDiscount;
