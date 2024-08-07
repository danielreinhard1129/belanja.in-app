"use client";
import { useAppSelector } from "@/redux/hooks";
import DiscountsStoreAdmin from "./components/StoreAdmin";
import DiscountsSuperAdmin from "./components/SuperAdmin";

const Discounts = () => {
  const { role } = useAppSelector((state) => state.user);
  return (
    <main className="container py-16">
      {role === "SUPERADMIN" ? (
        <DiscountsSuperAdmin />
      ) : (
        <DiscountsStoreAdmin />
      )}
    </main>
  );
};

export default Discounts;
