import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface DialogDeleteUserProps {
  userId: number;
  isReseting: boolean;
  handleResetPasswordStoreAdmin: (id: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogResetPasswordStoreAdmin: React.FC<DialogDeleteUserProps> = ({
  userId,
  isReseting,
  handleResetPasswordStoreAdmin,
  open,
  onOpenChange,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2">
          Reset Password
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset the password to
            default and will delete the old password.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isReseting}
            onClick={() => handleResetPasswordStoreAdmin(userId)}
            className="ml-2 px-4 py-2"
          >
            {isReseting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isReseting ? "Loading" : "Reset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogResetPasswordStoreAdmin;
