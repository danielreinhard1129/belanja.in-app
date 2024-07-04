"use client";

import UpdateUserAddressForm from "@/components/form/UpdateUserAddressForm";
import { useAppSelector } from "@/redux/hooks";

const EditAddressPage = ({ params }: { params: { addressId: string } }) => {
  const { id } = useAppSelector((state) => state.user);
  return (
    <div>
      <UpdateUserAddressForm addressId={Number(params.addressId)} userId={id} />
    </div>
  );
};

export default EditAddressPage;
