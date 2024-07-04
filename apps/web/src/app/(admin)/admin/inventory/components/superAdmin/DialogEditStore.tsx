import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
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
import useGetStore from "@/hooks/api/store/useGetStore";
import useUpdateStore from "@/hooks/api/store/useUpdateStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import {
  SchemaStore,
  schemaStore,
  defaultValues,
} from "../validationSchema/schemaStore";
import useGetCities from "@/hooks/api/store/useGetCities";
import { toast } from "sonner";

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
  const { store, refetch: refetchStore } = useGetStore(storeId);
  const { updateStore, isLoading } = useUpdateStore(storeId);
  const { storeAdmins } = useGetStoreAdmin();
  const { cities } = useGetCities();

  const methods = useForm<SchemaStore>({
    mode: "all",
    resolver: zodResolver(schemaStore),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    if (store) {
      reset({
        name: store.name || "",
        cityId: store.cityId?.toString() || "",
        storeAdminId: store.storeAdminId?.toString() || "",
      });
    }
  }, [store, reset]);

  const onSubmit: SubmitHandler<SchemaStore> = async (data) => {
    try {
      await updateStore(data);
      refetch();
      refetchStore();
      onOpenChange(false);
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Pencil size={16} />
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
              <FormInput<SchemaStore>
                name="name"
                label="Name"
                type="text"
                placeholder="Your name store"
              />
              <Controller
                name="cityId"
                control={control}
                render={({ field }) => (
                  <select {...field} className="mb-2 w-full">
                    <option value="" disabled>
                      Select a Product
                    </option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id.toString()}>
                        {city.citName}
                      </option>
                    ))}
                  </select>
                )}
              />
              <Controller
                name="storeAdminId"
                control={control}
                render={({ field }) => (
                  <select {...field} className="mb-2 w-full">
                    <option value="" disabled>
                      Select a Store Admin
                    </option>
                    <option value="">Nothing</option>
                    {storeAdmins.map((storeAdmin) => (
                      <option
                        key={storeAdmin.id}
                        value={storeAdmin.id.toString()}
                      >
                        {storeAdmin.user.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
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
