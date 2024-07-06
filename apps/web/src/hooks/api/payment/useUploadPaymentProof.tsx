"use client";
import React, { useState } from "react";
import useAxios from "../useAxios";
import { FileWithPath } from "react-dropzone";
import { toast } from "sonner";
import { AxiosError } from "axios";

const useUploadPaymentProof = () => {
  const { axiosInstance } = useAxios();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadPaymentProof = async ({
    payload,
  }: {
    payload: {
      orderId: number;
      paymentProof: FileList;
    };
  }) => {
    try {
        setIsLoading(true)
      const { orderId, paymentProof } = payload;
      const uploadProofForm = new FormData();

      if (orderId) uploadProofForm.append("orderId", String(orderId));
      if (paymentProof)
        Array.from(paymentProof).forEach((file: FileWithPath) =>
          uploadProofForm.append("paymentProof", file),
        );

      const { data } = await axiosInstance.patch(
        "payment/upload-proof",
        uploadProofForm,
      );

      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Unknown Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { uploadPaymentProof, isLoading };
};

export default useUploadPaymentProof;
