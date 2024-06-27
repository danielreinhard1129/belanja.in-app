// "use client";
// import { FormInput } from "@/components/FormInput";
// import { FormSelect } from "@/components/FormSelect";
// import { FormSelectStock } from "@/components/FormSelectStock";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import useGetProducts from "@/hooks/api/product/useGetProducts";
// import useGetStores from "@/hooks/api/store/useGetStoresByParams";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Plus, SquarePlus, Trash2 } from "lucide-react";
// import React, { useState } from "react";
// import {
//   FormProvider,
//   SubmitHandler,
//   useFieldArray,
//   useForm,
// } from "react-hook-form";
// import {
//   SchemaCreateStock,
//   defaultValues,
//   schemaCreateStock,
// } from "./schemaCreateStock";

// interface AddStockModal {
//   refetch: () => void;
// }

// export function AddStockModal({ refetch }: AddStockModal) {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [date, setDate] = React.useState<Date>();
//   const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
//   const { products } = useGetProducts();
//   const { stores } = useGetStores();
//   const methods = useForm<SchemaCreateStock>({
//     mode: "all",
//     resolver: zodResolver(schemaCreateStock),
//     defaultValues,
//   });
//   const { control, reset, handleSubmit } = methods;

//   const productsOptions = products.map((product) => ({
//     value: product.id.toString(),
//     label: product.name,
//     disabled: selectedProductIds.includes(product.id.toString()), // Men-disable jika sudah dipilih
//   }));

//   const storeOptions = stores.map((store) => ({
//     value: store.id.toString(),
//     label: store.name,
//   }));

//   const { append, fields, remove } = useFieldArray({
//     control,
//     name: "stocks",
//   });

//   const handleReset = () => {
//     reset(defaultValues);
//     setSelectedProductIds([]);
//   };

//   const handleAddStock = () => {
//     append({ productId: "", qty: 0 });
//   };

//   const handleProductChange = (productId: string, index: number) => {
//     const updatedSelectedProductIds = [...selectedProductIds];
//     updatedSelectedProductIds[index] = productId;
//     setSelectedProductIds(updatedSelectedProductIds);
//   };

//   // Cek apakah ada produk yang tersedia atau tidak
//   const isProductsAvailable = productsOptions.some(
//     (product) => !product.disabled,
//   );

//   const onSubmit: SubmitHandler<SchemaCreateStock> = async (data) => {
//     console.log(data);
//     reset(defaultValues);
//     await refetch();
//     setSelectedProductIds([]);
//     setIsOpen(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button className="flex gap-1 px-4 py-2">
//           <Plus /> Stock
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[470px]">
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <DialogHeader>
//               <DialogTitle>Add Stock</DialogTitle>
//               <DialogDescription>
//                 Create a new stock for your store.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="flex flex-col gap-4 py-4">
//               <FormSelect<SchemaCreateStock>
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
//                     <FormSelectStock<SchemaCreateStock>
//                       name={`stocks.${index}.productId`}
//                       label="Product"
//                       datas={productsOptions}
//                       onChange={(productId: string) =>
//                         handleProductChange(productId, index)
//                       }
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <FormInput<SchemaCreateStock>
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
//                       onClick={() => {
//                         remove(index);
//                       }}
//                     >
//                       <Trash2 size={20} />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="secondary"
//                 onClick={handleReset}
//                 className="px-4 py-2"
//               >
//                 Reset
//               </Button>
//               <Button type="submit" className="px-4 py-2">
//                 Add
//               </Button>
//             </DialogFooter>
//           </form>
//         </FormProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }
