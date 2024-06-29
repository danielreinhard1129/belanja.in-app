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
import { ClipboardPlus, Loader2, Pencil } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";

import {
  CreateStore,
  createStore,
  defaultValues,
} from "./validationSchema/createDiscount";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import useGetProducts from "@/hooks/api/product/useGetProducts";
import useCreateDiscount from "@/hooks/api/discounts/useCreateDiscount";
import useGetDiscount from "@/hooks/api/discounts/useGetDiscount";
import useUpdateDiscount from "@/hooks/api/discounts/useUpdateDiscount";

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
        productId: discount.product.name || "1",
      });
    }
  }, [discount, reset]);

  const onSubmit: SubmitHandler<CreateStore> = async (data) => {
    // console.log(data);
    const payload = { ...data, storeId: String(discount?.storeId) };
    await updateDiscount(payload, discountId);
    refetch();
    refetchDiscount();
    reset(defaultValues);
    onOpenChange(false);
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
              <DialogDescription>
                Edit a this discount {discount?.product.name}
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
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditDiscount;
