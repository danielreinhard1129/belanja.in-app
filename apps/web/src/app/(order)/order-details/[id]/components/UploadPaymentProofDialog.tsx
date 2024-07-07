"use client";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Countdown from "react-countdown";
import { IOrder, OrderStatus } from "@/types/order.type";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useUploadPaymentProof from "@/hooks/api/payment/useUploadPaymentProof";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Paperclip } from "lucide-react";

interface UploadPaymentProofDialogProps {
  order: IOrder;
  refetchOrder: () => void;
  openState: boolean;
  setOpenState: Dispatch<SetStateAction<boolean>>;
}

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const FormSchema = z.object({
  paymentProof: z
    .any()
    .refine(
      (files) => !files || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`,
    )
    .refine(
      (files) => !files || ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
});

type FormData = z.infer<typeof FormSchema>;

const UploadPaymentProofDialog: FC<UploadPaymentProofDialogProps> = ({
  order,
  refetchOrder,
  openState,
  setOpenState,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { uploadPaymentProof, isLoading } = useUploadPaymentProof();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paymentProof: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    const { paymentProof } = data;
    await uploadPaymentProof({ payload: { orderId: order.id, paymentProof } });
    setOpenState(false)
    refetchOrder();
  };

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogTrigger className="w-full">
        {/* <Button
          className="w-full px-4 py-2"
          disabled={order.status !== OrderStatus.WAITING_FOR_PAYMENT}
        >
          Upload Payment Proof
        </Button> */}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold">Pay To:</p>
          <p className="text-lg font-semibold">BCA 8610424628</p>
          <p className="text-lg font-semibold">a.n. Valerie Vincent Setiawan</p>
          <p className="font-semibold underline">BEFORE</p>
          <Countdown
            className="font-mono text-4xl"
            date={new Date(order.createdAt).getTime() + 60 * 60 * 1000}
          />
        </div>
        <div className="flex w-full flex-col gap-y-2 py-2 text-xs">
          <div className="flex items-center justify-between">
            <p>Payment Method</p>
            <p>
              {!order.Payment.paymentMethod
                ? "Belum bayar"
                : order.Payment.paymentMethod}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p>Purchase Total</p>
            <p>{order.totalAmount}</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Delivery fee</p>
            <p>{order.Delivery[0].deliveryFee}</p>
          </div>

          {order.Payment.paymentMethod === "MANUAL_TRANSFER" ? (
            <div className="flex items-center justify-between">
              <p>Payment proof</p>
              <p>
                {!order.Payment.paymentProof ? (
                  "No payment proof found"
                ) : (
                  <>See payment proof</>
                )}
              </p>
            </div>
          ) : null}
          <Separator />
          <div className="flex items-center justify-between text-lg font-semibold">
            <p>Total</p>
            <p>{order.Delivery[0].deliveryFee + order.totalAmount}</p>
          </div>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center">
            {selectedImage ? (
              <div className="relative w-96 h-64">
                <Image
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  // width={200}
                  // height={200}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div>No image uploaded</div>
            )}
            <FormField
              control={form.control}
              name="paymentProof"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Button size="default" type="button">
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
                        className="text-neutral-90 inline-flex cursor-pointer px-2 py-1 items-center rounded-md"
                      >
                        <Paperclip />
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
            <Button
              type="submit"
              className="w-full px-4 py-2 text-white"
              disabled={isLoading || !selectedImage}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadPaymentProofDialog;
