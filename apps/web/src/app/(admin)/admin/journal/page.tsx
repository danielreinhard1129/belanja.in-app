"use client";
import React from "react";
import { useAppSelector } from "@/redux/hooks";
import SuperAdmin from "./components/SuperAdmin";
import StoreAdmin from "./components/StoreAdmin";
const Journal = () => {
  const { role } = useAppSelector((state) => state.user);
  return <main>{role === "SUPERADMIN" ? <SuperAdmin /> : <StoreAdmin />}</main>;
};

export default Journal;
