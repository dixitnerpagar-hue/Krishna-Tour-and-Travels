import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";
import Fleet from "@/components/Fleet";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import ReadyToRide from "@/components/ReadyToRide";
import Reviews from "@/components/Reviews";
import RateUs from "@/components/RateUs";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/api";

export default function Home() {
  return (
    <div className="bg-neutral-50">
      <Header />

      <div className="relative">
        <Hero />
        {/* Floating booking form on hero */}
        <div className="absolute right-5 sm:right-10 top-32 lg:top-40 w-[calc(100%-2.5rem)] sm:w-[calc(100%-5rem)] lg:w-[520px] xl:w-[560px] z-20 hidden md:block">
          <BookingForm variant="hero" />
        </div>
      </div>

      {/* Mobile-only inline booking form */}
      <div className="md:hidden -mt-6 px-5 relative z-20" id="book-mobile">
        <BookingForm variant="alt" />
      </div>

      <Fleet />
      <Services />
      <WhyUs />
      <ReadyToRide />
      <Reviews />
      <RateUs />
      <GetInTouch />
      <Footer />

      {/* Floating WhatsApp */}
      <a
        href={buildWhatsAppLink(
          "Hello! I want to book a car. Also Submit your Aadhar card and Driving Licence."
        )}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 grid place-items-center transition-all hover:scale-110"
        data-testid="floating-whatsapp"
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
