// import React from "react";
// import { Loader2, SquarePlus, Trash2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { FormProvider, useFieldArray, useForm } from "react-hook-form";
// import { FormSelect } from "@/components/FormSelect";
// import { FormSelectStock } from "@/components/FormSelectStock";
// import { FormInput } from "@/components/FormInput";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   SchemaCreateStockMutation,
//   defaultValues,
//   schemaCreateStockMutation,
// } from "./schemaCreateStockMutation";
// import { zodResolver } from "@hookform/resolvers/zod";

// interface StockFormProps {
//   storeOptions: Array<{ value: string; label: string; disabled?: boolean }>;
//   productsOptions: Array<{ value: string; label: string; disabled?: boolean }>;
//   selectedProductIds: string[];
//   handleProductChange: (productId: string, index: number) => void;
//   handleRemoveStock: (index: number) => void;
//   handleAddStock: () => void;
//   handleReset: () => void;
//   onSubmit: (data: SchemaCreateStockMutation) => void;
//   isLoading: boolean;
// }

// const StockForm: React.FC<StockFormProps> = ({
//   storeOptions,
//   productsOptions,
//   selectedProductIds,
//   handleProductChange,
//   handleRemoveStock,
//   handleAddStock,
//   handleReset,
//   onSubmit,
//   isLoading,
// }) => {
//   const methods = useForm<SchemaCreateStockMutation>({
//     mode: "all",
//     resolver: zodResolver(schemaCreateStockMutation),
//     defaultValues,
//   });
//   const { handleSubmit, control } = methods;
//   const { fields } = useFieldArray({ control, name: "stocks" });

//   const isProductsAvailable = productsOptions.some(
//     (product) => !product.disabled,
//   );

//   return (
//     <FormProvider {...methods}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Card className="p-4">
//           <CardHeader className="ml-4">
//             <CardTitle>
//               {methods.getValues("type") === "export" ? "Export" : "Import"}
//             </CardTitle>
//             <CardDescription>
//               {methods.getValues("type") === "export"
//                 ? "Choose store you need to transfer"
//                 : "Choose store you need to request transfer"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col gap-4 py-4">
//               <FormSelect<SchemaCreateStockMutation>
//                 name="storeId"
//                 label="Store"
//                 datas={storeOptions}
//               />
//               <div className="flex items-center justify-between gap-4">
//                 <Button
//                   type="button"
//                   onClick={handleAddStock}
//                   className="px-4 py-2"
//                   disabled={!isProductsAvailable}
//                 >
//                   <div className="flex items-center justify-between gap-1">
//                     <SquarePlus size={20} /> <p>Stock</p>
//                   </div>
//                 </Button>
//                 <Label>Select the product and fill in how much you need</Label>
//               </div>
//               {!isProductsAvailable && (
//                 <div className="text-xs text-red-500">
//                   Products are out of stock
//                 </div>
//               )}
//               {fields.map((field, index) => (
//                 <div
//                   key={field.id}
//                   className="grid grid-cols-5 items-center gap-4"
//                 >
//                   <div className="col-span-2">
//                     <FormSelectStock<SchemaCreateStockMutation>
//                       name={`stocks.${index}.productId`}
//                       label="Product"
//                       datas={productsOptions}
//                       onChange={(productId: string) =>
//                         handleProductChange(productId, index)
//                       }
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <FormInput<SchemaCreateStockMutation>
//                       name={`stocks.${index}.qty`}
//                       label=""
//                       type="number"
//                       placeholder="Qty"
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       className="px-4 py-2"
//                       onClick={() => handleRemoveStock(index)}
//                     >
//                       <Trash2 size={20} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-end gap-2">
//             <Button
//               variant="secondary"
//               onClick={handleReset}
//               className="px-4 py-2"
//             >
//               Reset
//             </Button>
//             <Button disabled={isLoading} type="submit" className="px-4 py-2">
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               {isLoading ? "Loading" : "Submit"}
//             </Button>
//           </CardFooter>
//         </Card>
//       </form>
//     </FormProvider>
//   );
// };

// export default StockForm;
