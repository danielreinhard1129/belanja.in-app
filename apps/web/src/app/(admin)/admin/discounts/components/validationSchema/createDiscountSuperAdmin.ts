import { z } from "zod";

export const createStore = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  desc: z.string().min(10, "Description must be at least 4 characters long"),
  storeId: z.string().min(1, "Store is required"),
  discountType: z
    .string()
    .min(4, "Discount type must be at least 4 characters long"),
  discountvalue: z.number().optional(),
  discountLimit: z.number().optional(),
  minPurchase: z.number().optional(),
  productId: z.string().optional(),
});

export type CreateStore = z.infer<typeof createStore>;

export const defaultValues: CreateStore = {
  title: "",
  desc: "",
  storeId: "",
  discountType: "",
  discountvalue: 0,
  discountLimit: 0,
  minPurchase: undefined,
  productId: "",
};
