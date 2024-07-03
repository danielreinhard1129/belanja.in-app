import { z } from "zod";

export const schemaCreateStock = z.object({
  storeId: z.string().min(1, "Choose a store"),
  stocks: z.array(
    z.object({
      productId: z.string().min(1, "Choose a product"),
      qty: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
});
export type SchemaCreateStock = z.infer<typeof schemaCreateStock>;

export const defaultValues: SchemaCreateStock = {
  storeId: "",
  stocks: [],
};
