import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { FormSelectStock } from "@/components/FormSelectStock";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useGetProductsByStore from "@/hooks/api/store-product/useGetStoreProductByStore";
import useRequestStockMutation from "@/hooks/api/store-product/useRequestStockMutation";
import useGetStores from "@/hooks/api/store/useGetStores";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, Loader2, SquarePlus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import {
  SchemaCreateStockMutation,
  defaultValues,
  schemaCreateStockMutation,
} from "../validationSchema/schemaCreateStockMutation";
import { toast } from "sonner";

interface DialogRequestStockMutationProps {
  storeId: number;
  refetch: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogRequestStockMutation: React.FC<DialogRequestStockMutationProps> = ({
  storeId,
  refetch,
  open,
  onOpenChange,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const { products } = useGetProductsByStore(storeId);
  const { requestStockMutation, isLoading } = useRequestStockMutation();
  const { stores } = useGetStores();
  const methods = useForm<SchemaCreateStockMutation>({
    mode: "all",
    resolver: zodResolver(schemaCreateStockMutation),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });
  const { append, fields, remove } = useFieldArray({ control, name: "stocks" });

  const handleReset = () => {
    reset(defaultValues);
    setSelectedProductIds([]);
  };

  const handleAddStock = () => append({ productId: "", qty: 0 });

  const storeOptions = stores.map((store) => ({
    value: store.id.toString(),
    label: store.name,
    disabled: store.id === storeId,
  }));

  const productsOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
    disabled: selectedProductIds.includes(product.id.toString()),
  }));

  const handleProductChange = (productId: string, index: number) => {
    const updatedSelectedProductIds = [...selectedProductIds];
    updatedSelectedProductIds[index] = productId;
    setSelectedProductIds(updatedSelectedProductIds);
  };

  const handleRemoveStock = (index: number) => {
    const updatedSelectedProductIds = selectedProductIds.filter(
      (_, idx) => idx !== index,
    );
    setSelectedProductIds(updatedSelectedProductIds);
    remove(index);
  };

  const isProductsAvailable = productsOptions.some(
    (product) => !product.disabled,
  );

  const onSubmit = async (data: SchemaCreateStockMutation) => {
    const payload = { ...data, type: "MUTATION" };
    try {
      await requestStockMutation(payload, storeId);
      refetch();
      handleReset();
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

  if (!products) {
    return <div>Data Not Found</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} /> <span>Mutation</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Request Stock Mutation</DialogTitle>
              <DialogDescription>
                Choose store you need to request
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <FormSelect<SchemaCreateStockMutation>
                name="storeId"
                label="Store"
                datas={storeOptions}
              />
              <div className="flex items-center justify-between gap-4">
                <Button
                  type="button"
                  onClick={handleAddStock}
                  className="px-4 py-2"
                  disabled={!isProductsAvailable}
                >
                  <div className="flex items-center justify-between gap-1">
                    <SquarePlus size={20} /> <p>Stock</p>
                  </div>
                </Button>
                <Label>Select the product and fill in how much you need</Label>
              </div>
              {!isProductsAvailable && (
                <div className="text-xs text-red-500">
                  Products are out of stock
                </div>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-5 items-center gap-4"
                >
                  <div className="col-span-2">
                    <FormSelectStock<SchemaCreateStockMutation>
                      name={`stocks.${index}.productId`}
                      label="Product"
                      datas={productsOptions}
                      onChange={(productId: string) =>
                        handleProductChange(productId, index)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <FormInput<SchemaCreateStockMutation>
                      name={`stocks.${index}.qty`}
                      label=""
                      type="number"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      className="px-4 py-2"
                      onClick={() => handleRemoveStock(index)}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              ))}
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
                {isLoading ? "Loading" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogRequestStockMutation;
