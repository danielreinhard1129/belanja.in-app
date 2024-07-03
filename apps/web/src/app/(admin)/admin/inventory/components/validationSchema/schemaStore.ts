import { z } from "zod";

export const schemaStore = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  // provinceId: z.string().min(1, "Province is required"),
  cityId: z.string().min(1, "City is required"),
  storeAdminId: z.string().optional(),
});

export type SchemaStore = z.infer<typeof schemaStore>;

export const defaultValues: SchemaStore = {
  name: "",
  // provinceId: "",
  cityId: "",
  storeAdminId: "",
};

// import { z } from "zod";

// export const schemaCreateStore = z.object({
//   name: z.string().min(4, "Name must be at least 4 characters long"),
//   addressLine: z
//     .string({
//       required_error: "Address line is required",
//     })
//     .min(2, {
//       message: "Address must be at least 2 characters.",
//     }),
//   postalCode: z.number({
//     required_error: "Postal code is required",
//   }),
//   cityId: z.number({
//     required_error: "City is required",
//   }),
//   provinceId: z.number({
//     required_error: "Province ID is required",
//   }),
//   subdistrictId: z.number({
//     required_error: "Subdistrict ID is required",
//   }),
//   storeAdminId: z.string().optional(),
// });

// export type SchemaCreateStore = z.infer<typeof schemaCreateStore>;

// export const defaultValues: SchemaCreateStore = {
//   name: "",
//   addressLine: "",
//   postalCode: 0, // harus diisi dengan angka
//   cityId: 0, // harus diisi dengan angka
//   provinceId: 0, // harus diisi dengan angka
//   subdistrictId: 0, // harus diisi dengan angka
//   storeAdminId: "", // boleh diisi string atau undefined
// };
