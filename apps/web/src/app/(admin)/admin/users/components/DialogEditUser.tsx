import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useGetUser from "@/hooks/api/user/useGetUserWithStoreAdmin";
import { format } from "date-fns";
import React from "react";

interface DialogEditUserProps {
  userId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogEditUser: React.FC<DialogEditUserProps> = ({
  userId,
  onOpenChange,
  open,
}) => {
  const { user } = useGetUser(userId);
  if (!user) return <div>Data Not Found</div>;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User</DialogTitle>
          <DialogDescription>Detail About User</DialogDescription>
          <div className="grid w-full grid-cols-11">
            <div className="col-span-5 font-semibold">Name</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.name}</div>
            <div className="col-span-5 font-semibold">Email</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.email}</div>
            <div className="col-span-5 font-semibold">Address ID</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.addressId}</div>
            <div className="col-span-5 font-semibold">Address</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.addressId}</div>
            {/* <div className="col-span-5 font-semibold">Birtdate</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">
              {format(new Date(user?.birthDate), "yyyy-MM-dd")}
            </div> */}
            <div className="col-span-5 font-semibold">Gender</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.gender}</div>
            <div className="col-span-5 font-semibold">Is Verified</div>
            <div className="col-span-1 text-center">:</div>
            <div className="col-span-5">{user?.isVerified}</div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditUser;
