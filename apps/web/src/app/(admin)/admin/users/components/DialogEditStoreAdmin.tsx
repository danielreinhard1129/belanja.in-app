import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useResetPasswordStoreAdmin from "@/hooks/api/store-admin/useResetPasswordStoreAdmin";
import useUpdateStoreAdmin from "@/hooks/api/store-admin/useUpdateStoreAdmin";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { toast } from "sonner";
import DialogResetPasswordStoreAdmin from "./DialogResetPasswordStoreAdmin";
import {
  defaultValues,
  editStoreAdmin,
  EditStoreAdmin,
} from "./validationSchema/editStoreAdmin";

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
  const { resetPasswordStoreAdmin, isReseting } = useResetPasswordStoreAdmin();
  const [isOpenDialogResetPassword, setIsOpenDialogResetPassword] =
    useState<boolean>(false);

  const methods = useForm<EditStoreAdmin>({
    mode: "all",
    resolver: zodResolver(editStoreAdmin),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  const handleResetPasswordStoreAdmin = async (id: number) => {
    await resetPasswordStoreAdmin(id);
  };

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
    try {
      await updateStoreAdmin(data, userId);
      refetchUser();
      refetch();
      reset(defaultValues);
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
              <DialogResetPasswordStoreAdmin
                userId={userId}
                isReseting={isReseting}
                handleResetPasswordStoreAdmin={handleResetPasswordStoreAdmin}
                open={isOpenDialogResetPassword}
                onOpenChange={setIsOpenDialogResetPassword}
              />
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
