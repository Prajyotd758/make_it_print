import Hero from "@/components/landingPageComponents/Hero";
import Marquee from "@/components/landingPageComponents/Marquee";
import Services from "@/components/landingPageComponents/Services";
import Modules from "@/components/landingPageComponents/Modules";
import Gallery from "@/components/landingPageComponents/Gallery";
import Customers from "@/components/landingPageComponents/Customers";
import Reviews from "@/components/landingPageComponents/Reviews";
import Contact from "@/components/landingPageComponents/Contact";
import Footer from "@/components/landingPageComponents/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Modules />
        <Gallery />
        <Customers />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
