"use client";

import AuthGuardHome from "@/hoc/AuthGuardHome";
import HeroCarousel from "../components/HeroCarousel";
import TodaysPick from "../components/TodaysPick";

const Home = () => {
  return (
    <main className="mt-20 md:mt-28 grid gap-6">
      <HeroCarousel />
      <TodaysPick />
    </main>
  );
};

export default AuthGuardHome(Home);
