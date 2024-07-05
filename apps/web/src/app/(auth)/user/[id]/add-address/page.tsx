"use client";

import AddUserAddressForm from "@/components/form/AddUserAddressForm";
import { useAppSelector } from "@/redux/hooks";

const AddAddressPage = () => {
  const { id } = useAppSelector((state) => state.user);
  return (
    <div>
      <AddUserAddressForm userId={id} />
    </div>
  );
};

export default AddAddressPage;
