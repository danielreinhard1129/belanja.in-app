"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import hero1 from "../../../public/Green Yellow Modern Grocery Online Order Banner (1).png";
import hero2 from "../../../public/Green Bold Grocery Market Store Facebook Post (1).png";
import hero3 from "../../../public/Green Modern Fruits Sale Instagram Post (1400 x 640 px) (1).png";

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const images = [hero1, hero2, hero3];

  const plugin = useRef(Autoplay({ delay: 5000 }));

  const handleMouseEnter = () => {
    plugin.current.stop();
  };

  const handleMouseLeave = () => {
    plugin.current.play();
  };

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className="group container overflow-hidden p-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        plugins={[plugin.current]}
        setApi={setApi}
        className="h-48 md:h-fit"
      >
        <CarouselContent className="flex">
          {images.map((image, index) => (
            <CarouselItem key={index} className="flex-shrink-0">
              <Card className="rounded-none border-none shadow-none md:rounded-lg">
                <CardContent className="relative flex h-48 w-full items-center justify-center md:h-[400px]">
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-8 bottom-0 hidden transition-all group-hover:left-4 md:flex" />
        <CarouselNext className="-right-8 bottom-0 hidden transition-all group-hover:right-4 md:flex" />
      </Carousel>
      <div className="mx-auto flex w-fit py-1.5">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={`mx-1.5 h-2 w-2 rounded-full ${
              current === index + 1 ? "bg-[#FF6100]" : "bg-[#CDCDCD]"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
