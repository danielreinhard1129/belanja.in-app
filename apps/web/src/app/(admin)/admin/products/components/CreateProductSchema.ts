import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 30 characters long"),
  price: z.number().positive("Price must be a positive number"),
  weight: z.number().positive("Price must be a positive number"),
  categories: z
    .array(z.any())
    .min(1, { message: "At least one category must be selected" }),
  images: z
    .array(z.any())
    .min(1, { message: "You must upload at least one image" })
    .max(5, { message: "You can only upload up to 5 images" }),
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;

export const defaultValues: TCreateProductSchema = {
  name: "",
  description: "",
  price: 0,
  weight: 0,
  categories: [],
  images: [],
};
