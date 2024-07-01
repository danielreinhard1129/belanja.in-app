import React from "react";
import { Loader2, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  createStoreAdmin,
  CreateStoreAdmin,
  defaultValues,
} from "./validationSchema/createStoreAdmin";
import { FormInput } from "@/components/FormInput";
import useCreateStoreAdmin from "@/hooks/api/store-admin/useCreateStoreAdmin";

interface DialogCreateStoreAdminProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogCreateStoreAdmin: React.FC<DialogCreateStoreAdminProps> = ({
  onOpenChange,
  open,
  refetch,
}) => {
  const { createStoreAdmin: createSA, isLoading } = useCreateStoreAdmin();
  const methods = useForm<CreateStoreAdmin>({
    mode: "all",
    resolver: zodResolver(createStoreAdmin),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  const onSubmit: SubmitHandler<CreateStoreAdmin> = async (data) => {
    // console.log(data);
    await createSA(data);
    refetch();
    reset(defaultValues);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className="flex justify-between gap-2">
          <UserPlus /> <span> Store Admin</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Store Admin</DialogTitle>
              <DialogDescription>
                create a nip to identifier a store admin
              </DialogDescription>
              <div className="mt-4">
                <FormInput<CreateStoreAdmin>
                  name="nip"
                  label="NIP"
                  type="number"
                  placeholder=""
                />
              </div>
              <div className="mt-4">
                <FormInput<CreateStoreAdmin>
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Name"
                />
              </div>
              <div className="mt-4">
                <FormInput<CreateStoreAdmin>
                  name="email"
                  label="Email"
                  type="text"
                  placeholder="Email"
                />
              </div>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button disabled={isLoading} type="submit" className="px-4 py-2">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateStoreAdmin;
