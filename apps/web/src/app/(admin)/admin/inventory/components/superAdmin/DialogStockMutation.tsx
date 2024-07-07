import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { FormSelectStock } from "@/components/FormSelectStock";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCreateStockSuperAdmin from "@/hooks/api/store-product/useCreateStockSuperAdmin";
import useGetProductsByStore from "@/hooks/api/store-product/useGetStoreProductByStore";
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
import { toast } from "sonner";
import {
  SchemaCreateStockMutation,
  defaultValues,
  schemaCreateStockMutation,
} from "../validationSchema/schemaCreateStockMutation";
interface DialogStockMutationProps {
  storeId: number;
  refetch: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DialogStockMutation: React.FC<DialogStockMutationProps> = ({
  storeId,
  refetch,
  open,
  onOpenChange,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("export");
  const { products } = useGetProductsByStore(storeId);
  const { createStockSuperAdmin, isLoading } = useCreateStockSuperAdmin();
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
    const payload = { ...data, type: activeTab };
    try {
      await createStockSuperAdmin(payload, storeId);
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
        <DialogHeader>
          <DialogTitle>Mutation</DialogTitle>
          <DialogDescription>
            Export or Import Store Product you need
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs
              defaultValue="export"
              className="mt-4 w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="import">Import</TabsTrigger>
              </TabsList>
              <TabsContent value="export">
                <Card className="p-4">
                  <CardHeader className="ml-4">
                    <CardTitle>Export</CardTitle>
                    <CardDescription>
                      Choose store you need to transfer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Label>
                          Select the product and fill in how much you need
                        </Label>
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
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
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
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Loading" : "Submit"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="import">
                <Card className="p-4">
                  <CardHeader className="ml-4">
                    <CardTitle>Import</CardTitle>
                    <CardDescription>
                      Choose store you need to request transfer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                        <Label>
                          Select the product and fill in how much you need
                        </Label>
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
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
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
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isLoading ? "Loading" : "Submit"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
export default DialogStockMutation;
