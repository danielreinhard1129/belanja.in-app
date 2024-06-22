"use client";

import BrowseByCategory from "../components/BrowseByCategory";
import HeroCarousel from "../components/HeroCarousel";
import TodaysPick from "../components/TodaysPick";

export default function Home() {
  return (
    <main className="grid gap-6 py-6">
      <HeroCarousel />
      <TodaysPick />
      <div className="bg-[#f5f5f5] py-4">
        <BrowseByCategory />
      </div>
    </main>
  );
}
