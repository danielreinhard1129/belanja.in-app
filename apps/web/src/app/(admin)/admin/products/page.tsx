"use client";
import { useAppSelector } from "@/redux/hooks";
import StoreAdmin from "./components/storeAdmin/StoreAdmin";
import SuperAdmin from "./components/superAdmin/SuperAdmin";

const Product = () => {
  const { role } = useAppSelector((state) => state.user);
  return (
    <main className="container py-16">
      {role === "SUPERADMIN" ? <SuperAdmin /> : <StoreAdmin />}
    </main>
  );
};

export default Product;
