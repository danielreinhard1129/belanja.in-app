"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ImagePlus, Loader2, Paperclip } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import useUpdateUserDetails from "@/hooks/api/auth/useUpdateUserDetails";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import Image from "next/image";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
  avatarUrl: z
    .any()
    .refine(
      (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`,
    )
    .refine(
      (files) => !files || ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    )
    .optional(),
});

type FormData = z.infer<typeof FormSchema>;

const UpdateUserDetailsForm = ({ params }: { params: { id: string } }) => {
  const { name, email, birthDate, gender } = useAppSelector(
    (state) => state.user,
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { isLoading, updateUserDetails } = useUpdateUserDetails(
    Number(params.id),
  );
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name || "",
      email: email || "",
      gender: gender || "",
      birthDate: birthDate ? new Date(birthDate) : undefined,
      avatarUrl: undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    updateUserDetails(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {selectedImage ? (
          <div className="md:max-w-[200px]">
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              width={200}
              height={200}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="inline-flex items-center justify-between">
            <div className="flex items-center justify-center bg-slate-200 p-3">
              <ImagePlus size={56} />
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Button size="lg" type="button">
                  <input
                    type="file"
                    className="hidden"
                    id="fileInput"
                    accept="image/*"
                    onBlur={field.onBlur}
                    name={field.name}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      setSelectedImage(e.target.files?.[0] || null);
                    }}
                    ref={field.ref}
                  />
                  <label
                    htmlFor="fileInput"
                    className="text-neutral-90 inline-flex cursor-pointer items-center rounded-md"
                  >
                    <Paperclip />
                    <span className="whitespace-nowrap">Choose your image</span>
                  </label>
                </Button>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your gender" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] px-4 py-2 pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1990}
                    toYear={2024}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full px-4 py-2 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Submitting" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateUserDetailsForm;
