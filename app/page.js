import Hero from "./components/hero";
import Booking from "./components/booking";
import BestSelling from "./components/BestSelling";
import Services from "./components/Services";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Booking />
      <BestSelling />
      <Services />
      <ContactSection />
    </>
  );
}
