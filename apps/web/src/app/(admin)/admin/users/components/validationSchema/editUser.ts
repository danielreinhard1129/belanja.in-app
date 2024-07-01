import { z } from "zod";

export const editUser = z.object({
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

export type EditUser = z.infer<typeof editUser>;

export const defaultValues: EditUser = {
  name: "",
  email: "",
};
