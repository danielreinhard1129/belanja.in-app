import {
  BookMarked,
  Box,
  Briefcase,
  Home,
  NotepadText,
  NotepadText,
  Users,
  TicketPercent,
  Percent,
  DollarSign,
} from "lucide-react";

export const listsSuper = [
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
  {
    name: "Vouchers",
    url: "/admin/vouchers",
    icon: <TicketPercent size={20} />,
  },
  {
    name: "Journals",
    url: "/admin/journals",
    icon: <BookMarked size={20} />,
  },
  {
    name: "Sales & Report",
    url: "/admin/reports",
    icon: <DollarSign size={20} />,
  },
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
  {
    name: "Journals",
    url: "/admin/journals",
    icon: <BookMarked size={20} />,
  },
  {
    name: "Sales & Report",
    url: "/admin/reports",
    icon: <DollarSign size={20} />,
  },
];

export const baseClass = "bg-[#FF6100] text-white border-none flex gap-4";
