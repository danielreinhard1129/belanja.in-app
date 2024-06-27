"use client";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import DiscountsStoreAdmin from "./components/StoreAdmin";
import DiscountsSuperAdmin from "./components/SuperAdmin";

const Discounts = () => {
  const { role } = useAppSelector((state) => state.user);
  return (
    <main className="container py-20">
      {role === "SUPERADMIN" ? (
        <DiscountsSuperAdmin />
      ) : (
        <DiscountsStoreAdmin />
      )}
    </main>
  );
};

export default Discounts;
