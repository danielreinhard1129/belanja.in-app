import Image from "next/image";
import logo from "../../public/belanjainlogotransparent.svg";

const Loading = () => {
  return (
    <div className="relative h-screen w-screen content-center">
      <Image
        src={logo}
        alt="logo_loading"
        className="mx-auto my-auto h-[200px] w-[200px] animate-pulse md:h-[400px] md:w-[400px]"
      />
    </div>
  );
};

export default Loading;
