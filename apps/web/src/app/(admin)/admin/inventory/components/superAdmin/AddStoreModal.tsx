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
import useCreateStore from "@/hooks/api/store/useCreateStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import {
  SchemaStore,
  defaultValues,
  schemaStore,
} from "../validationSchema/schemaStore";
import useGetStoreAdminNoStore from "@/hooks/api/store-admin/useGetStoreAdminNoStore";
import useGetCities from "@/hooks/api/store/useGetCities";
import { toast } from "sonner";

interface AddStoreModalProps {
  refetch: () => void;
}

export function AddStoreModal({ refetch }: AddStoreModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { createStore, isLoading } = useCreateStore();
  const { storeAdmins } = useGetStoreAdminNoStore();
  const { cities } = useGetCities();
  const citiesOptions = cities.map((city) => ({
    value: city.id.toString(),
    label: city.citName,
  }));
  const storeAdminsOptions = storeAdmins.map((storeAdmin) => ({
    value: storeAdmin.id.toString(),
    label: storeAdmin.user.name,
  }));
  const methods = useForm<SchemaStore>({
    mode: "all",
    resolver: zodResolver(schemaStore),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit: SubmitHandler<SchemaStore> = async (data) => {
    try {
      await createStore(data);
      refetch();
      reset(defaultValues);
      setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 px-4 py-2">
          <Plus /> Store
        </Button>
      </DialogTrigger>
      <FormProvider {...methods}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Store</DialogTitle>
              <DialogDescription>
                Create a new store to expand your business.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <FormInput<SchemaStore>
                name="name"
                label="Name"
                type="text"
                placeholder="Your name store"
              />
              <FormSelect<SchemaStore>
                name="cityId"
                label="City"
                datas={citiesOptions}
              />
              <FormSelect<SchemaStore>
                name="storeAdminId"
                label="Store Admin"
                datas={storeAdminsOptions}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="px-4 py-2"
              >
                Reset
              </Button>
              <Button
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
