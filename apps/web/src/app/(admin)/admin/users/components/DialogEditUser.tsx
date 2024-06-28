import React from "react";
import { FilePenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetUser from "@/hooks/api/user/useGetUser";

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
  const { user } = useGetUser(userId);
  return (
    <Dialog>
      <DialogTrigger>
        <FilePenLine />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <div>{user?.name}</div>
          <div>{user?.email}</div>
          <div>{user?.gender}</div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditUser;
