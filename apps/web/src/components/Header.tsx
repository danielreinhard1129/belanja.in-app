"use client";

import { Search, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import logo from "../../public/belanjainlogotransparent.svg";
import { Separator } from "./ui/separator";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutAction } from "@/redux/slices/userSlice";
import useGoogleAuth from "@/hooks/api/auth/useGoogleAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const { id, name, avatarUrl, role, provider } = useAppSelector(
    (state) => state.user,
  );
  const dispatch = useAppDispatch();
  const { logout } = useGoogleAuth();

  const userLogout = async () => {
    try {
      localStorage.removeItem("token");
      await dispatch(logoutAction());
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav>
      <div className="container m-0 mx-auto flex h-20 items-center justify-between px-4 py-2 md:px-[120px]">
        <div className="items-center">
          <Image
            src={logo}
            alt="logo"
            height={34}
            className="cursor-pointer"
            draggable={false}
          />
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="relative hidden w-[320px] items-center md:flex">
            <Input
              className="bg-[#f5f5f5] px-5"
              placeholder="What are you looking for?"
            />
            <Search size="20px" color="#7c7c7c" className="absolute right-5" />
          </div>
          <Button
            variant="ghost"
            className="block rounded-full px-2 py-2 hover:bg-[#f5f5f5] md:hidden"
          >
            <Search size="20px" color="#7C7C7C" />
          </Button>
          <div>
            <Button
              variant="ghost"
              className="rounded-full px-2 py-2 hover:bg-[#f5f5f5]"
            >
              <ShoppingCart size="20px" color="#7c7c7c" />
            </Button>
          </div>
          {Boolean(id) ? (
            <div className="flex items-center">
              {role === "USER" ? (
                <Button
                  variant="link"
                  className="px-4 py-2"
                  onClick={() => router.push(`/user/${id}`)}
                >
                  {Boolean(avatarUrl) ? (
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={avatarUrl} alt="pfp" />
                        <AvatarFallback>{name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                      <p>{name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p>{name}</p>
                    </div>
                  )}
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="px-4 py-2"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              )}
              {provider === "GOOGLE" ? (
                <Button
                  variant="link"
                  className="px-4 py-2"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="px-4 py-2"
                  onClick={() => userLogout()}
                >
                  Logout
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="hidden gap-2 md:flex">
                <Button
                  variant="link"
                  className="px-4 py-2"
                  onClick={() => router.push("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2"
                  onClick={() => router.push("/register")}
                >
                  Register
                </Button>
              </div>
              <div className="flex md:hidden">
                <Button variant="link">Login/Register</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator />
    </nav>
  );
};
