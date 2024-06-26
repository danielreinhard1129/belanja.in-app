import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

const BackToHome = () => {
  const router = useRouter();
  return (
    <div className="w-full content-center">
      <Button
        variant="ghost"
        className="px-0 pt-6 pb-10 text-[#7b7b7b] hover:text-black"
        onClick={() => router.push("/")}
      >
        <ChevronLeft className="mr-4" />
        Back to website
      </Button>
    </div>
  );
};

export default BackToHome;
