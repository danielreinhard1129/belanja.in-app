import {
  Box,
  Briefcase,
  Home,
  NotepadText,
  Percent,
  User,
  Users,
} from "lucide-react";

export const listsSuper = [
  { name: "Home", url: "/admin", icon: <Home size={20} /> },
  { name: "Products", url: "/admin/products", icon: <Box size={20} /> },
  {
    name: "Order List",
    url: "/admin/order-list",
    icon: <NotepadText size={20} />,
  },
  {
    name: "Inventory",
    url: "/admin/inventory",
    icon: <Briefcase size={20} />,
  },
  { name: "Users", url: "/admin/users", icon: <Users size={20} /> },
  { name: "Discounts", url: "/admin/discounts", icon: <Percent size={20} /> },
];

export const listsNoStore = [
  { name: "Home", url: "/admin", icon: <Home size={20} /> },
  { name: "Products", url: "/admin/products", icon: <Box size={20} /> },
  { name: "Profile", url: "/admin/profile", icon: <User size={20} /> },
];

export const lists = [
  { name: "Home", url: "/admin", icon: <Home size={20} /> },
  { name: "Products", url: "/admin/products", icon: <Box size={20} /> },
  {
    name: "Order List",
    url: "/admin/order-list",
    icon: <NotepadText size={20} />,
  },
  { name: "Discounts", url: "/admin/discounts", icon: <Percent size={20} /> },
  {
    name: "Inventory",
    url: "/admin/inventory",
    icon: <Briefcase size={20} />,
  },
  { name: "Profile", url: "/admin/profile", icon: <User size={20} /> },
];

export const baseClass = "bg-[#FF6100] text-white border-none flex gap-4";
