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
import {
  CalendarIcon,
  ChevronLeft,
  ImagePlus,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import useUpdateUserDetails from "@/hooks/api/auth/useUpdateUserDetails";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import Image from "next/image";
import { appConfig } from "@/utils/config";
import avatarDefault from "../../../public/default-avatar.png";
import useGetUser from "@/hooks/api/auth/useGetUser";
import { useRouter } from "next/navigation";

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
  const { name, email, avatarUrl, birthDate, gender, id } = useAppSelector(
    (state) => state.user,
  );
  const router = useRouter();
  const { user } = useGetUser(id);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex w-full flex-col px-4"
      >
        <div className="flex flex-col space-y-4">
          <div className="container flex h-fit w-full items-center justify-between gap-4 bg-white px-0 pb-4 pt-4 md:justify-start">
            <Button
              variant="secondary"
              className="rounded-full p-2 text-black hover:bg-gray-400 hover:text-white"
              onClick={() => router.push(`/user/${id}`)}
            >
              <ChevronLeft size={16} />
            </Button>
            <h1 className="text-lg font-medium">Edit Profile</h1>
            <Button
              variant="secondary"
              className="rounded-full p-2 opacity-0"
              onClick={() => router.push("/")}
            >
              <ChevronLeft size={16} color="black" />
            </Button>
          </div>
          <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
            {selectedImage ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                <Image
                  src={
                    (user?.avatarUrl
                      ? `${appConfig.baseUrl}/assets${user.avatarUrl}`
                      : avatarDefault) as string
                  }
                  alt="pfp"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button
                      size="lg"
                      variant="secondary"
                      type="button"
                      className="w-full md:w-fit"
                    >
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
                        className="text-neutral-90 inline-flex cursor-pointer items-center gap-2 rounded-md"
                      >
                        <Paperclip size={20} />
                        <span className="whitespace-nowrap">
                          Choose your image
                        </span>
                      </label>
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="md:max-w-lg"
                    placeholder="Enter your name"
                    {...field}
                  />
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
                  <Input
                    type="email"
                    className="md:max-w-lg"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value || gender}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Prefer not to say" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Prefer not to say
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full px-4 py-2 pl-3 text-left font-normal md:max-w-lg",
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
            className="w-full max-w-lg px-4 py-2 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting" : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserDetailsForm;
