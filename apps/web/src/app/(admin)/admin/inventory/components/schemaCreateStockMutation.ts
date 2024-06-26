import { z } from "zod";

export const schemaCreateStockMutation = z.object({
  storeId: z.string().min(1, "Choose a store"),
  stocks: z.array(
    z.object({
      productId: z.string().min(1, "Choose a product"),
      qty: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
});
export type SchemaCreateStockMutation = z.infer<
  typeof schemaCreateStockMutation
>;

export const defaultValues: SchemaCreateStockMutation = {
  storeId: "",
  stocks: [],
};

// import { z } from "zod";

// export const schemaCreateStockMutation = z.object({
//   storeId: z.string().nonempty("Store is required"),
//   stocks: z.array(
//     z.object({
//       productId: z.string().nonempty("Product is required"),
//       qty: z.number().min(1, "Quantity must be at least 1"),
//     }),
//   ),
//   type: z.enum(["export", "import"]),
// });

// export type SchemaCreateStockMutation = z.infer<
//   typeof schemaCreateStockMutation
// >;

// export const defaultValues: SchemaCreateStockMutation = {
//   storeId: "",
//   stocks: [{ productId: "", qty: 0 }],
//   type: "export",
// };
