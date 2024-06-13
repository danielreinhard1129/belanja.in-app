"use client";

import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UserDetail = ({ params }: { params: { id: string } }) => {
  const { id, name, avatarUrl, email } = useAppSelector((state) => state.user);

  const { isLoading, sendChangePassword, onSuccess } = useSendChangePassword();

  useEffect(() => {
    if (onSuccess) {
      alert(`email for change password has been sent to ${email}`);
    }
  }, [onSuccess]);

  return (
    <div>
      <div>ID = {id}</div>
      <div>Name = {name}</div>
      <div>Email = {email}</div>
      <Button
        className="px-4 py-2"
        onClick={() => sendChangePassword({ id })}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Change password"}
      </Button>
    </div>
  );
};

export default UserDetail;
