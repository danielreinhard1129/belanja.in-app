import { Undo2 } from "lucide-react";
import Link from "next/link";
import notfound404 from "../../public/404.svg";
import notfoundbg from "../../public/404_BG.png";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[100vh] flex-col items-center justify-center py-20">
      <h1 className="mb-4 text-6xl font-bold">Oops!</h1>
      <h2 className="text-2xl font-semibold">You are lost</h2>
      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={notfound404}
          alt="404"
          className="absolute z-50 object-cover"
        />
        <Image
          src={notfoundbg}
          alt="404bg"
          className="absolute z-10 object-cover"
        />
      </div>
      <div className="border-b border-black">
        <Link className="flex gap-2" href={"/"}>
          <Undo2 size={20} />
          Go Home
        </Link>
      </div>
    </div>
  );
}
