import React, { useEffect } from "react";
import { FilePenLine, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import {
  editStoreAdmin,
  EditStoreAdmin,
  defaultValues,
} from "./validationSchema/editStoreAdmin";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import useUpdateStoreAdmin from "@/hooks/api/store-admin/useUpdateStoreAdmin";

interface DialogEditStoreAdminProps {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogEditStoreAdmin: React.FC<DialogEditStoreAdminProps> = ({
  userId,
  onOpenChange,
  open,
  refetch,
}) => {
  const { user, refetch: refetchUser } = useGetUser(userId);
  const { updateStoreAdmin, isLoading } = useUpdateStoreAdmin();

  const methods = useForm<EditStoreAdmin>({
    mode: "all",
    resolver: zodResolver(editStoreAdmin),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    if (user) {
      reset({
        nip: user?.storeAdmin?.nip || 0,
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<EditStoreAdmin> = async (data) => {
    // console.log(data);
    await updateStoreAdmin(data, userId);
    refetchUser();
    refetch();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Store Admin</DialogTitle>
              <DialogDescription>Edit this store admin</DialogDescription>
              <div className="mt-4">
                <FormInput<EditStoreAdmin>
                  name="nip"
                  label="NIP"
                  type="number"
                  placeholder=""
                />
              </div>
              <div className="mt-4">
                <FormInput<EditStoreAdmin>
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Name"
                />
              </div>
              <div className="mt-4">
                <FormInput<EditStoreAdmin>
                  name="email"
                  label="Email"
                  type="text"
                  placeholder="Email"
                />
              </div>
            </DialogHeader>
            <DialogFooter className="mt-4">
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
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditStoreAdmin;
