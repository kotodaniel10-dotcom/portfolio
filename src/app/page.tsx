"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import ThemePicker from "@/components/ThemePicker";
import TehilaEasterEgg from "@/components/TehilaEasterEgg";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative">
      <ParticleField />
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Footer />
      <ThemePicker />
      <TehilaEasterEgg />
    </main>
  );
}
