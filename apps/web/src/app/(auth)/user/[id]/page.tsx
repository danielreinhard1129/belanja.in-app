"use client";

import { Button } from "@/components/ui/button";
import useSendChangePassword from "@/hooks/api/auth/useSendChangePassword";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetail = () => {
  const { id, name, avatarUrl, email, gender, birthDate } = useAppSelector(
    (state) => state.user,
  );
  const router = useRouter();

  const {
    isLoading: isSendingChangePassword,
    sendChangePassword,
    onSuccess,
  } = useSendChangePassword();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onSuccess) {
      alert(`Email for change password has been sent to ${email}`);
    }
  }, [onSuccess, email]);

  const handleEditProfile = async () => {
    setIsLoading(true);
    try {
      // Perform any asynchronous operations here, if needed
      router.push(`/user/${id}/edit-profile`);
    } catch (error) {
      console.error("Error during profile edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={String(avatarUrl)}
          alt="pfp"
          width={200}
          height={200}
          className="rounded-full"
        />
      ) : (
        <p>No profile picture</p>
      )}
      <div>ID = {id}</div>
      <div>Name = {name}</div>
      <div>Email = {email}</div>
      <div>Gender = {gender}</div>
      <div>Birth Date = {String(birthDate)}</div>
      <Button
        className="px-4 py-2"
        onClick={() => sendChangePassword({ id })}
        disabled={isSendingChangePassword}
      >
        {isSendingChangePassword ? "Loading..." : "Change Password"}
      </Button>
      <p>p</p>
      <Button
        className="px-4 py-2"
        onClick={handleEditProfile}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Edit Profile"}
      </Button>
    </div>
  );
};

export default UserDetail;
