"use client";
import { useAppSelector } from "@/redux/hooks";
import StoreAdmin from "./components/StoreAdmin";
import SuperAdmin from "./components/SuperAdmin";

const Product = () => {
  const { role } = useAppSelector((state) => state.user);
  return (
    <main className="container py-20">
      {role === "SUPERADMIN" ? <SuperAdmin /> : <StoreAdmin />}
    </main>
  );
};

export default Product;
