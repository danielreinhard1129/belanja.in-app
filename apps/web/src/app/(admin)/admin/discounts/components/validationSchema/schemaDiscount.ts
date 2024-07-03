import { z } from "zod";

export const schemaDiscount = z.object({
  title: z.string().min(4, "Title must be at least 4 characters long"),
  desc: z.string().min(10, "Description must be at least 4 characters long"),
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
  isActive: z.boolean().optional(),
});

export type SchemaDiscount = z.infer<typeof schemaDiscount>;

export const defaultValues: SchemaDiscount = {
  title: "",
  desc: "",
  discountType: "",
  discountvalue: 0,
  discountLimit: 0,
  minPurchase: undefined,
  productId: "",
};
