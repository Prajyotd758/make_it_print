import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Modules from "@/components/Modules";
import Gallery from "@/components/Gallery";
import Customers from "@/components/Customers";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
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
