"use client";

import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const UserDetail = () => {
  const { id, name, avatarUrl, email, gender, birthDate } = useAppSelector((state) => state.user);
  const router = useRouter();

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
      <div>Gender = {gender}</div>
      <div>Birth Date = {String(birthDate)}</div>
      <Button
        className="px-4 py-2"
        onClick={() => sendChangePassword({ id })}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Change password"}
      </Button>
      <Button
        className="px-4 py-2"
        onClick={() => router.push(`/user/${id}/edit-profile`)}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Edit Profile"}
      </Button>
    </div>
  );
};

export default UserDetail;
