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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { editUser, EditUser, defaultValues } from "./validationSchema/editUser";
import { FormInput } from "@/components/FormInput";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import useUpdateUser from "@/hooks/api/user/useUpdateUser";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DialogEditUserProps {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

const DialogEditUser: React.FC<DialogEditUserProps> = ({
  userId,
  onOpenChange,
  open,
  refetch,
}) => {
  const { user, refetch: refetchUser } = useGetUser(userId);
  const { updateUser, isLoading } = useUpdateUser();

  const methods = useForm<EditUser>({
    mode: "all",
    resolver: zodResolver(editUser),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<EditUser> = async (data) => {
    try {
      await updateUser(data, userId);
      refetch();
      refetchUser();
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Edit this User</DialogDescription>
              <div className="mt-4">
                <FormInput<EditUser>
                  name="name"
                  label="Name"
                  type="text"
                  placeholder="Name"
                />
              </div>
              <div className="mt-4">
                <FormInput<EditUser>
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

export default DialogEditUser;
