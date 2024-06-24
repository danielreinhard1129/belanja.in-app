import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetStoreAdmin from "@/hooks/api/store-admin/useGetStoreAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SchemaEditStore, schemaEditStore } from "./schemaEditStore";
import { useEffect, useState } from "react";
import useUpdateStore from "@/hooks/api/store/useUpdateStore";
import useGetStore from "@/hooks/api/store/useGetStore";

interface DialogEditStoreProps {
  storeId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

export function DialogEditStore({
  refetch,
  open,
  onOpenChange,
  storeId,
}: DialogEditStoreProps) {
  const { store } = useGetStore(storeId);
  const { updateStore, isLoading } = useUpdateStore(storeId);
  const { storeAdmins } = useGetStoreAdmin();
  const storeAdminsOptions = storeAdmins.map((storeAdmin) => ({
    value: storeAdmin.id.toString(),
    label: storeAdmin.user.name,
  }));
  const methods = useForm<SchemaEditStore>({
    mode: "all",
    resolver: zodResolver(schemaEditStore),
  });
  const { reset, handleSubmit } = methods;

  console.log(store);

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        city: store.city,
        lat: store.lat,
        long: store.long,
        storeAdminId: {
          value: (store.storeAdmin?.id || "").toString(),
          label: store.storeAdmin?.user.name || "",
        },
      });
    }
  }, [store, reset]);

  const onSubmit: SubmitHandler<SchemaEditStore> = async (data) => {
    console.log(data);
    // await updateStore(data);
    refetch();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer gap-2">
          <Pencil size={20} />
          Edit
        </div>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Store</DialogTitle>
              <DialogDescription>
                Edit store to expand your business.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <FormInput<SchemaEditStore>
                name="name"
                label="Name"
                type="text"
                placeholder="Your name store"
              />
              <FormInput<SchemaEditStore>
                name="city"
                label="City"
                type="text"
                placeholder="Your city store"
              />
              <FormInput<SchemaEditStore>
                name="lat"
                label="Lat"
                type="text"
                placeholder="your store location - lat"
              />
              <FormInput<SchemaEditStore>
                name="long"
                label="Long"
                type="text"
                placeholder="your store location - long"
              />
              <FormSelect<SchemaEditStore>
                name="storeAdminId"
                label="Store Admin"
                datas={storeAdminsOptions}
              />
            </div>
            <DialogFooter>
              <Button disabled={isLoading} type="submit" className="px-4 py-2">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
