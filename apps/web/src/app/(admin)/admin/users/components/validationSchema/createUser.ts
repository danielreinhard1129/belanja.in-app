import { z } from "zod";

export const createStoreAdmin = z.object({
  nip: z.number().min(0, "Nip value must be at least 0"),
  userId: z.string().min(1, "User value must be at least 1"),
});

export type CreateStoreAdmin = z.infer<typeof createStoreAdmin>;

export const defaultValues: CreateStoreAdmin = {
  nip: 0,
  userId: "",
};
