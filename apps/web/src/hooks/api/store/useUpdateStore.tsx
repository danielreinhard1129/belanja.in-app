"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormStore } from "@/types/store.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useUpdateStore = (storeId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAppSelector((state) => state.user);
  const updateStore = async (data: IFormStore) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        city: data.city,
        lat: data.lat,
        long: String(data.long),
        storeAdminId: String(data.storeAdminId),
      };

      await axiosInstance.patch(`/stores/${storeId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Store created successfully!",
      });
      // router.push("/admin/stock");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateStore, isLoading };
};

export default useUpdateStore;
