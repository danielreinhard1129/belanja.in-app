"use client";

import UpdateUserAddressForm from "@/components/form/UpdateUserAddressForm";
import { useAppSelector } from "@/redux/hooks";

const EditAddressPage = ({ params }: { params: { id: string } }) => {
  const { id } = useAppSelector((state) => state.user);
  return (
    <div>
      <UpdateUserAddressForm addressId={Number(params.id)} userId={id} />
    </div>
  );
};

export default EditAddressPage;
