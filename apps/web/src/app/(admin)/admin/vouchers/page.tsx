"use client";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import VouchersStoreAdmin from "./components/StoreAdmin";
import VouchersSuperAdmin from "./components/SuperAdmin";

const Vouchers = () => {
  const { role } = useAppSelector((state) => state.user);
  return (
    <main className="container py-20">
      {role === "SUPERADMIN" ? <VouchersSuperAdmin /> : <VouchersStoreAdmin />}
    </main>
  );
};

export default Vouchers;
