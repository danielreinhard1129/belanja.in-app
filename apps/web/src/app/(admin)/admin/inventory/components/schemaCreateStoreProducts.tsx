import { z } from "zod";

export const schemaCreateStoreProducts = z.object({
  stocks: z.array(
    z.object({
      productId: z.string().min(1, "Choose a product"),
      qty: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
});
export type SchemaCreateStoreProducts = z.infer<
  typeof schemaCreateStoreProducts
>;

export const defaultValues: SchemaCreateStoreProducts = {
  stocks: [],
};
