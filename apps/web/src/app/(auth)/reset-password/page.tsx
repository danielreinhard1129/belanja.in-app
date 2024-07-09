"use client";

import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import { notFound, useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const searchParams = useSearchParams();

  const searchToken = searchParams.get("token");
  if (!searchToken) {
    return notFound();
  }

  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
