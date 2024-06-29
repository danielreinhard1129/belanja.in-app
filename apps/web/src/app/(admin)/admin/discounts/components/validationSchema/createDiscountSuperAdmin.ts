import { z } from "zod";

export const createStore = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  desc: z.string().min(10, "Description must be at least 4 characters long"),
  storeId: z.string().min(1, "Store is required"),
  discountType: z
    .string()
    .min(4, "Discount type must be at least 4 characters long"),
  discountvalue: z
    .number()
    .positive("Discount Value must be a positive number"),
  discountLimit: z
    .number()
    .positive("Discount Limit must be a positive number"),
  minPurchase: z.number().optional(),
  productId: z.string().min(1, "Product is required"),
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
