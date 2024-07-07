"use client";

import { AlignJustify, ChevronRight, X } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "../../public/belanjainlogotransparent.svg";
import { Separator } from "./ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { appConfig } from "@/utils/config";
import defaultAvatar from "../../public/default-avatar.png";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"; // prettier-ignore
import { useEffect, useState } from "react";
import Logo from "./Logo";
import useGetUser from "@/hooks/api/auth/useGetUser";
import { googleLogout } from "@react-oauth/google";

export const Header = () => {
  const router = useRouter();
  const { id, name, provider, email } = useAppSelector((state) => state.user); // prettier-ignore
  const dispatch = useAppDispatch();
  const [hideHeader, setHideHeader] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { user, isLoading } = useGetUser(id);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("Authorization");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsLoggedIn(false);
    router.replace("/");
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem("Authorization");
    dispatch(logoutAction());
    setIsLoggedIn(false);
    router.push("/");
  };

  const scrollThreshold = 40;

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

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-20 w-full overflow-x-hidden bg-inherit p-0 transition-transform duration-500 ${hideHeader ? "-translate-y-full" : "translate-y-0"} border-b`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between p-0 px-6 py-2">
        <Logo />
        <div className="flex items-center gap-2 md:gap-6">
          {isLoggedIn && user && !isLoading ? (
            <div className="flex items-center gap-10">
              <div
                className="hidden cursor-pointer items-center gap-2 hover:underline md:flex"
                onClick={() => router.push(`/user/${id}`)}
              >
                <div className="relative h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    src={
                      (user.avatarUrl
                        ? `${appConfig.baseUrl}/assets${user.avatarUrl}`
                        : defaultAvatar) as string
                    }
                    alt="pfp"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-sm font-medium">{name}</div>
              </div>
              <div>
                <Button
                  variant="link"
                  className="hidden px-0 py-2 text-red-500 hover:underline md:flex"
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
                                (user.avatarUrl
                                  ? `${appConfig.baseUrl}/assets${user.avatarUrl}`
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
                      <div
                        className="cursor-pointer text-red-500 hover:underline"
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
    </nav>
  );
};
