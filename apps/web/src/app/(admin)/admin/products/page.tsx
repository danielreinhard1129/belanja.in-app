"use client";
import React from "react";
import SuperAdmin from "./components/SuperAdmin";
import StoreAdmin from "./components/StoreAdmin";
import { useAppSelector } from "@/redux/hooks";

const Product = () => {
  const { role } = useAppSelector((state) => state.user);
  return <main>{role === "SUPERADMIN" ? <SuperAdmin /> : <StoreAdmin />}</main>;
};

export default Product;
