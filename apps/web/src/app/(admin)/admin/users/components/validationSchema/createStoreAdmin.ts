import { z } from "zod";

export const createStoreAdmin = z.object({
  nip: z.number().positive("Nip value must be at least 0"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
});

export type CreateStoreAdmin = z.infer<typeof createStoreAdmin>;

export const defaultValues: CreateStoreAdmin = {
  nip: 0,
  name: "",
  email: "",
};
