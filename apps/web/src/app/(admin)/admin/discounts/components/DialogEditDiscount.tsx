import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import {
  SchemaDiscount,
  schemaDiscount,
  defaultValues,
} from "./validationSchema/schemaDiscount";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import useGetProducts from "@/hooks/api/product/useGetProducts";
import useGetDiscount from "@/hooks/api/discounts/useGetDiscount";
import useUpdateDiscount from "@/hooks/api/discounts/useUpdateDiscount";
import { toast } from "sonner";

interface DialogEditDiscountProps {
  discountId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogEditDiscount: React.FC<DialogEditDiscountProps> = ({
  discountId,
  onOpenChange,
  open,
  refetch,
}) => {
  const { discount, refetch: refetchDiscount } = useGetDiscount(discountId);
  const { updateDiscount, isLoading } = useUpdateDiscount();
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

  useEffect(() => {
    if (discount) {
      reset({
        title: discount.title || "",
        desc: discount.desc || "",
        discountType: discount.discountType || "",
        discountvalue: discount.discountvalue || 0,
        discountLimit: discount.discountLimit || 0,
        minPurchase: discount.minPurchase || 0,
        productId: discount.productId.toString() || "",
        isActive: discount.isActive,
      });
    }
  }, [discount, reset]);

  const onSubmit: SubmitHandler<SchemaDiscount> = async (data) => {
    const payload = { ...data, storeId: String(discount?.storeId) };
    // console.log(payload);
    try {
      await updateDiscount(payload, discountId);
      refetchDiscount();
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
        <div className="flex cursor-pointer items-center gap-2">
          <Pencil size={18} />
          Edit
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Discount</DialogTitle>
              <DialogDescription>Edit a this discount</DialogDescription>
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
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <select {...field} className="mb-2 w-full">
                    <option value="" disabled>
                      Select a Product
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id.toString()}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                )}
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
            <div className="flex items-center justify-between">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="text-xs">Is Still Active ?</div>
                  </div>
                )}
              />
              <Button
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Update"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditDiscount;
