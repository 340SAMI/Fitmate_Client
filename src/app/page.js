import Hero from "@/component/home/HeroSection";
import PopularClasses from "@/component/home/PopularClasses";
import SectionDivider from "@/component/home/SectionDivider";
import Image from "next/image";

export default function Home() {
  return(
  <>
   <Hero></Hero>
   <SectionDivider></SectionDivider>
  <PopularClasses></PopularClasses>
  </>
   
  )
}
