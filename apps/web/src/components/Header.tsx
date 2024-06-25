"use client";

import { AlignJustify, ChevronRight, X } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "../../public/belanjainlogotransparent.svg";
import { Separator } from "./ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { useRouter } from "next/navigation";
import { appConfig } from "@/utils/config";
import defaultAvatar from "../../public/default-avatar.png";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";

export const Header = () => {
  const router = useRouter();
  const { id, name, avatarUrl, provider, email } = useAppSelector(
    (state) => state.user,
  );
  const dispatch = useAppDispatch();
  const { logout } = useGoogleAuth();
  const userLogout = async () => {
    localStorage.removeItem("Authorization");
    await dispatch(logoutAction());
    router.push("/");
  };
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const scrollThreshold = 100;
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        if (currentScrollTop > scrollThreshold) {
          setHideHeader(true);
        }
      } else {
        setHideHeader(false);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-20 w-full bg-inherit p-0 transition-transform duration-300 overflow-x-hidden ${hideHeader ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between p-0 px-6 py-2">
        <div className="items-center">
          <Image
            src={logo}
            alt="logo"
            height={34}
            className="cursor-pointer"
            draggable={false}
            onClick={() => router.push("/")}
          />
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          {Boolean(id) ? (
            <div className="flex items-center gap-10">
              <div
                className="hidden cursor-pointer items-center gap-2 hover:underline md:flex"
                onClick={() => router.push(`/user/${id}`)}
              >
                <Avatar>
                  <AvatarImage
                    src={
                      (provider === "GOOGLE"
                        ? avatarUrl
                        : `${appConfig.baseUrl}/assets${avatarUrl}`) as string
                    }
                    alt="avatar"
                  />
                </Avatar>
                <div className="text-sm font-medium">{name}</div>
              </div>
              <div>
                <Button
                  variant="link"
                  className="hidden px-0 py-2 md:flex"
                  onClick={() =>
                    provider === "GOOGLE" ? logout() : userLogout()
                  }
                >
                  Logout
                </Button>
              </div>
              <div className="flex md:hidden">
                <Sheet>
                  <SheetTrigger>
                    <AlignJustify size={20} />
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <div className="flex h-20 w-full items-center justify-between p-0 px-6 py-2">
                        <Image
                          src={logo}
                          alt="logo"
                          height={34}
                          className="cursor-pointer"
                          draggable={false}
                          onClick={() => router.push("/")}
                        />
                        <SheetClose>
                          <X size={20} />
                        </SheetClose>
                      </div>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 px-6">
                      <div className="mt-6 flex items-center justify-between">
                        <div
                          className="flex cursor-pointer items-center gap-4"
                          onClick={() => router.push(`/user/${id}`)}
                        >
                          <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image
                              src={
                                (provider === "GOOGLE"
                                  ? avatarUrl
                                  : `${appConfig.baseUrl}/assets${avatarUrl}`) as string
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
                      <div>Cart</div>
                      <div>Cart</div>
                      <div>Cart</div>
                      <Separator />
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          provider === "GOOGLE" ? logout() : userLogout()
                        }
                      >
                        Logout
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ) : (
            <div className="gap-2 md:flex">
              <Button
                variant="link"
                className="hidden px-4 py-2 md:flex"
                onClick={() => router.push("/login")}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="hidden px-4 py-2 md:flex"
                onClick={() => router.push("/register")}
              >
                Register
              </Button>
              <Image
                src={defaultAvatar}
                alt="default-avatar"
                className="flex h-6 w-6 cursor-pointer md:hidden"
                onClick={() => router.push("/login")}
              />
            </div>
          )}
        </div>
      </div>
      <Separator />
    </nav>
  );
};
