import React from "react";
import logo from "../../../../../public/belanjainlogotransparent.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { AlignJustify, ChevronRight, LogOut, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { logoutAction } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { appConfig } from "@/utils/config";
import { Separator } from "@/components/ui/separator";
import defaultAvatar from "../../../../../public/default-avatar.png";
import { lists, baseClass } from "./helpers";
import Logo from "@/components/Logo";

const Navbar = () => {
  const { provider, id, name, email, avatarUrl } = useAppSelector(
    (state) => state.user,
  );
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { logout } = useGoogleAuth();
  const userLogout = () => {
    localStorage.removeItem("Authorization");
    dispatch(logoutAction());
    router.push("/");
  };

  return (
    <nav className="flex w-full flex-row items-center justify-between gap-4 border-b-2 px-5 py-6 md:h-screen md:max-w-[240px] md:flex-col md:justify-start md:border-b-0 md:border-r-2">
      <div className="flex md:hidden">
        <Logo />
      </div>
      <div className="hidden h-full w-full items-center justify-between gap-2 md:flex md:flex-col">
        <div className="flex w-full flex-col items-center gap-2">
          <div className="mb-10">
            <Logo />
          </div>
          {lists.map((item, index) => (
            <Button
              key={index}
              variant="secondary"
              className={`${baseClass} ${item.url === pathname ? "w-full justify-start px-4 py-3" : "w-full justify-start bg-white px-4 py-3 text-black/50"}`}
              onClick={() => router.replace(item.url)}
            >
              {item.icon}
              {item.name}
            </Button>
          ))}
        </div>
        <div className="hidden w-full gap-8 md:flex md:flex-col">
          <div className="items-center justify-between px-3">
            <div
              className="flex w-full cursor-pointer items-center justify-start gap-4"
              onClick={() => router.push(`/user/${id}`)}
            >
              <div className="relative flex h-9 w-12 items-center overflow-hidden rounded-full bg-black">
                <Image
                  src={
                    (avatarUrl
                      ? `${appConfig.baseUrl}/assets${avatarUrl}`
                      : defaultAvatar) as string
                  }
                  alt="pfp"
                  height={200}
                  width={200}
                  className="object-cover"
                />
              </div>
              <div className="w-full">
                <p className="line-clamp-1 text-sm font-medium">{name}</p>
                <p className="line-clamp-1 text-xs text-black/50">{email}</p>
              </div>
            </div>
          </div>
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
              <div className="mb-6 flex h-20 w-full items-center justify-between p-0 px-6 py-2">
                <Logo />
                <SheetClose>
                  <X size={20} />
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="flex h-[80vh] flex-col gap-4 px-4">
              <div className="mt-6 flex items-center justify-between">
                <div
                  className="flex cursor-pointer items-center gap-4"
                  onClick={() => router.push(`/user/${id}`)}
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={
                        (avatarUrl
                          ? `${appConfig.baseUrl}/assets${avatarUrl}`
                          : defaultAvatar) as string
                      }
                      alt="pfp"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="line-clamp-1 max-w-full font-medium">
                      {name}
                    </div>
                    <div className="line-clamp-1 max-w-full text-xs text-black/50">
                      {email}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} />
              </div>
              <Separator />
              {lists.map((item, index) => (
                <SheetClose>
                  <Button
                    key={index}
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
