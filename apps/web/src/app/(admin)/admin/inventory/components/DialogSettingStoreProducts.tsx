import { FormInput } from "@/components/FormInput";
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
import useGetProducts from "@/hooks/api/product/useGetProducts";
import useGetProductsByStore from "@/hooks/api/store-product/useGetStoreProductByStore";
import useRequestStockMutation from "@/hooks/api/store-product/useRequestStockMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings2, SquarePlus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  SchemaCreateStoreProducts,
  defaultValues,
  schemaCreateStoreProducts,
} from "./schemaCreateStoreProducts";

interface DialogSettingStoreProductsProps {
  storeId: number;
  refetch: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogSettingStoreProducts: React.FC<DialogSettingStoreProductsProps> = ({
  storeId,
  refetch,
  open,
  onOpenChange,
}) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("increase");
  const { products: productsReduce } = useGetProductsByStore(storeId);
  const { products } = useGetProducts();
  const { requestStockMutation, isLoading } = useRequestStockMutation();
  const methods = useForm<SchemaCreateStoreProducts>({
    mode: "all",
    resolver: zodResolver(schemaCreateStoreProducts),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { append, fields, remove } = useFieldArray({ control, name: "stocks" });
  
  const handleReset = () => {
    reset(defaultValues);
    setSelectedProductIds([]);
  };

  useEffect(() => {
    handleReset();
  }, [storeId, activeTab, handleReset]);

  const handleAddStock = () => append({ productId: "", qty: 0 });

  const productsOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.name,
    disabled: selectedProductIds.includes(product.id.toString()),
  }));

  const productsReduceOptions = productsReduce.map((product) => ({
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

  const isProductsReduceAvailable = productsReduceOptions.some(
    (product) => !product.disabled,
  );

  const onSubmit = async (data: SchemaCreateStoreProducts) => {
    const payload = { ...data, type: activeTab, storeId: String(storeId) };
    // console.log(payload);
    await requestStockMutation(payload, storeId);
    onOpenChange(false);
    refetch();
    handleReset();
  };

  if (!products || !productsReduce) {
    return <div>Data Not Found</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="flex items-center gap-2">
          <Settings2 size={16} /> <span>Products</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Tabs
              defaultValue="increase"
              className="mt-4 w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="increase">Increase</TabsTrigger>
                <TabsTrigger value="decrease">Decrease</TabsTrigger>
              </TabsList>
              <TabsContent value="increase">
                <Card className="p-4">
                  <CardHeader className="ml-4">
                    <CardTitle>Increase</CardTitle>
                    <CardDescription>
                      Choose product you need to increase or add
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 py-4">
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
                            <FormSelectStock<SchemaCreateStoreProducts>
                              name={`stocks.${index}.productId`}
                              label="Product"
                              datas={productsOptions}
                              onChange={(productId: string) =>
                                handleProductChange(productId, index)
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <FormInput<SchemaCreateStoreProducts>
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
                      variant="secondary"
                      onClick={handleReset}
                      className="px-4 py-2"
                    >
                      Reset
                    </Button>
                    <Button
                      disabled={isLoading}
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
              <TabsContent value="decrease">
                <Card className="p-4">
                  <CardHeader className="ml-4">
                    <CardTitle>Decrease</CardTitle>
                    <CardDescription>
                      Choose product you need to decrease or delete
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <Button
                          type="button"
                          onClick={handleAddStock}
                          className="px-4 py-2"
                          disabled={!isProductsReduceAvailable}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <SquarePlus size={20} /> <p>Stock</p>
                          </div>
                        </Button>
                        <Label>
                          If you want to delete, reduce the quantity to 0
                        </Label>
                      </div>
                      {!isProductsReduceAvailable && (
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
                            <FormSelectStock<SchemaCreateStoreProducts>
                              name={`stocks.${index}.productId`}
                              label="Product"
                              datas={productsReduceOptions}
                              onChange={(productId: string) =>
                                handleProductChange(productId, index)
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <FormInput<SchemaCreateStoreProducts>
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
                      variant="secondary"
                      onClick={handleReset}
                      className="px-4 py-2"
                    >
                      Reset
                    </Button>
                    <Button
                      disabled={isLoading}
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

export default DialogSettingStoreProducts;
