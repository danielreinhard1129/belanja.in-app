import React from "react";
import logo from "../../../../../public/belanjainlogotransparent.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  AlignJustify,
  BookMarked,
  Box,
  Briefcase,
  Home,
  LogOut,
  Users,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { useDispatch } from "react-redux";
import { logoutAction } from "@/redux/slices/userSlice";
import { useAppSelector } from "@/redux/hooks";

const Navbar = () => {
  const { provider } = useAppSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { logout } = useGoogleAuth();
  const userLogout = async () => {
    localStorage.removeItem("Authorization");
    await dispatch(logoutAction());
    router.push("/");
  };

  const lists = [
    { name: "Home", url: "/admin", icon: <Home size={20} /> },
    { name: "Products", url: "/admin/products", icon: <Box size={20} /> },
    {
      name: "Inventory",
      url: "/admin/inventory",
      icon: <Briefcase size={20} />,
    },
    { name: "Users", url: "/admin/users", icon: <Users size={20} /> },
    {
      name: "Journals",
      url: "/admin/journals",
      icon: <BookMarked size={20} />,
    },
  ];
  const baseClass = "bg-[#FF6100] text-white border-none flex gap-4";

  return (
    <nav className="flex w-full flex-row items-center justify-between gap-4 border-b-2 px-5 py-6 md:h-screen md:max-w-[240px] md:flex-col md:justify-start md:border-b-0 md:border-r-2">
      <div className="w-34 relative md:mb-10 md:hidden">
        <Image
          src={logo}
          alt="logo"
          height={34}
          className="cursor-pointer"
          draggable={false}
          onClick={() => router.push("/admin")}
        />
      </div>
      <div className="hidden h-full w-full items-center justify-between gap-2 md:flex md:flex-col">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="w-34 relative md:mb-10">
            <Image
              src={logo}
              alt="logo"
              height={34}
              className="cursor-pointer"
              draggable={false}
              onClick={() => router.push("/admin")}
            />
          </div>
          {lists.map((item) => (
            <Button
              variant="secondary"
              className={`${baseClass} ${item.url === pathname ? "w-full justify-start px-4 py-3" : "w-full justify-start bg-white px-4 py-3 text-black/50"}`}
              onClick={() => router.replace(item.url)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </div>
        <div className="hidden w-full md:flex">
          <Button
            variant="link"
            className="w-fit justify-start gap-4 px-4 py-3 text-red-500"
            onClick={() => (provider === "GOOGLE" ? logout() : userLogout())}
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </div>
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger>
            <AlignJustify size={20} />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <div className="mb-10 flex h-20 w-full items-center justify-between p-0 px-6 py-2">
                <Image
                  src={logo}
                  alt="logo"
                  height={34}
                  className="cursor-pointer"
                  draggable={false}
                  onClick={() => router.push("/admin")}
                />
                <SheetClose>
                  <X size={20} />
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="flex h-[80vh] flex-col gap-4 px-4">
              {lists.map((item) => (
                <SheetClose>
                  <Button
                    variant="secondary"
                    className={`${baseClass} ${item.url === pathname ? "w-full justify-start px-4 py-3" : "w-full justify-start bg-white px-4 py-3 text-black/50"}`}
                    onClick={() => router.replace(item.url)}
                  >
                    {item.icon}
                    {item.name}
                  </Button>
                </SheetClose>
              ))}
              <div className="relative h-full w-full">
                <Button
                  variant="link"
                  className="absolute bottom-0 justify-start gap-4 px-4 py-3 text-red-500"
                  onClick={() =>
                    provider === "GOOGLE" ? logout() : userLogout()
                  }
                >
                  <LogOut size={20} />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
