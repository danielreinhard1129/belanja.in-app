import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../public/belanjainlogotransparent.svg";

const Logo = () => {
  const router = useRouter();

  return (
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
  );
};

export default Logo;
