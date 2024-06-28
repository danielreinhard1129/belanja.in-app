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
} from "./validationSchema/createUser";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import useCreateStoreAdmin from "@/hooks/api/user/useCreateStoreAdmin";
import useGetUserNotSuperAdmin from "@/hooks/api/user/useGetUserNotSuperAdmin";

interface DialogEditUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogCreateUser: React.FC<DialogEditUserProps> = ({
  onOpenChange,
  open,
  refetch,
}) => {
  const { createStoreAdmin: createSA, isLoading } = useCreateStoreAdmin();
  const { users } = useGetUserNotSuperAdmin();
  const methods = useForm<CreateStoreAdmin>({
    mode: "all",
    resolver: zodResolver(createStoreAdmin),
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  const usersOptions = users.map((user) => ({
    value: user.id.toString(),
    label: user.name,
  }));

  const onSubmit: SubmitHandler<CreateStoreAdmin> = async (data) => {
    console.log(data);
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
                create a nip to identifier a user as store admin, select user
                you want to be
              </DialogDescription>
              <div className="pt-2">
                <div className="mb-4">
                  <FormSelect<CreateStoreAdmin>
                    name="userId"
                    label="User"
                    datas={usersOptions}
                  />
                </div>
                <FormInput<CreateStoreAdmin>
                  name="nip"
                  label="NIP"
                  type="number"
                  placeholder=""
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

export default DialogCreateUser;
