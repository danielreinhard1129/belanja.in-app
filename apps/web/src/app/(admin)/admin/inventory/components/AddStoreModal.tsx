import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import useGetStoreAdmin from "@/hooks/api/store-admin/useGetStoreAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  SchemaCreateStore,
  defaultValues,
  schemaCreateStore,
} from "./schemaCreateStore";
import { useState } from "react";

interface AddStoreModalProps {
  refetch: () => void;
}

export function AddStoreModal({ refetch }: AddStoreModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { createStore, isLoading } = useCreateStore();
  const { storeAdmins } = useGetStoreAdmin();
  const storeAdminsOptions = storeAdmins.map((storeAdmin) => ({
    value: storeAdmin.id.toString(),
    label: storeAdmin.user.name,
  }));
  const methods = useForm<SchemaCreateStore>({
    mode: "all",
    resolver: zodResolver(schemaCreateStore),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  const handleReset = () => {
    reset(defaultValues);
  };

  const onSubmit: SubmitHandler<SchemaCreateStore> = async (data) => {
    console.log(data);
    await createStore(data);
    refetch();
    reset(defaultValues);
    setIsOpen(false);
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
              <FormInput<SchemaCreateStore>
                name="name"
                label="Name"
                type="text"
                placeholder="Your name store"
              />
              <FormInput<SchemaCreateStore>
                name="city"
                label="City"
                type="text"
                placeholder="Your city store"
              />
              <FormInput<SchemaCreateStore>
                name="lat"
                label="Lat"
                type="text"
                placeholder="your store location - lat"
              />
              <FormInput<SchemaCreateStore>
                name="long"
                label="Long"
                type="text"
                placeholder="your store location - long"
              />
              <FormSelect<SchemaCreateStore>
                name="storeAdminId"
                label="Store Admin"
                datas={storeAdminsOptions}
              />
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={handleReset}
                className="px-4 py-2"
              >
                Reset
              </Button>
              <Button disabled={isLoading} type="submit" className="px-4 py-2">
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
