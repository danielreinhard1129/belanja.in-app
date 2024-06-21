import Image from "next/image";
import { Separator } from "./ui/separator";
import logo from "../../public/belanjainlogotransparent.svg";
import { Button } from "./ui/button";
import twitter from "../../public/twitter-icon.svg";
import linkedin from "../../public/linkedin-square-icon.svg";

export const Footer = () => {
  return (
    <div>
      <Separator />
      <div className="container mx-auto grid grid-cols-2 justify-between px-4 py-10 md:flex md:px-[120px] md:py-20">
        <div className="col-span-2 mb-10 grid gap-6 md:mb-0">
          <Image src={logo} alt="logo" draggable={false} />
          <p className="max-w-[296px] text-sm text-[#7C7C7C]">
            The #1 B2B marketplace that can bring grocery at hands.
          </p>
          <div className="flex gap-6">
            <Image src={twitter} alt="twitter" width={24} height={24} />
            <Image src={linkedin} alt="linkedin" width={24} height={24} />
          </div>
        </div>
        <div className="mb-10 md:mb-0">
          <ul className="grid gap-4">
            <li className="text-sm font-semibold">Links</li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Marketplace
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Dashboard
              </Button>
            </li>
          </ul>
        </div>
        <div>
          <ul className="grid gap-4">
            <li className="text-sm font-semibold">Resources</li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Guides
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Support Center
              </Button>
            </li>
          </ul>
        </div>
        <div>
          <ul className="grid gap-4">
            <li className="text-sm font-semibold">Developers</li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                API Guides
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                API Reference
              </Button>
            </li>
          </ul>
        </div>
        <div>
          <ul className="grid gap-4">
            <li className="text-sm font-semibold">Company</li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Careers
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                className="text-sm font-normal text-[#7C7C7C]"
              >
                Terms of Service
              </Button>
            </li>
          </ul>
        </div>
      </div>
      <Separator />
      <div className="container mx-auto flex justify-between px-4 py-4 md:px-[120px]">
        <p className="text-sm text-[#7C7C7C]">
          © belanja.in 2024 market/supermarket
        </p>
        <p className="text-sm text-[#7C7C7C]">
          Reserved by CHIBAI (China Banyak Ilmu) Co. Ltd.
        </p>
      </div>
    </div>
  );
};
