"use client";

import AuthGuardHome from "@/hoc/AuthGuardHome";
import BrowseByCategory from "../components/BrowseByCategory";
import HeroCarousel from "../components/HeroCarousel";
import TodaysPick from "../components/TodaysPick";

const Home = () => {
  return (
    <main className="grid gap-6 mt-20">
      <HeroCarousel />
      <TodaysPick />
      <div className="bg-[#f5f5f5] py-4">
        <BrowseByCategory />
      </div>
    </main>
  );
};

export default AuthGuardHome(Home);
