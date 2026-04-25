import { useRef, useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";
import Fleet from "@/components/Fleet";
import PremiumFleet from "@/components/PremiumFleet";
import Routes from "@/components/Routes";
import Services from "@/components/Services";
import WhyUs from "@/components/WhyUs";
import Emergency from "@/components/Emergency";
import ReadyToRide from "@/components/ReadyToRide";
import Reviews from "@/components/Reviews";
import RateUs from "@/components/RateUs";
import GetInTouch from "@/components/GetInTouch";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WA_DOC_NOTE } from "@/lib/api";

export default function Home() {
  const [presetTrip, setPresetTrip] = useState(null);

  // Auto-focus the booking form when a route is picked
  const onPickRoute = (route, trip) => {
    setPresetTrip(trip);
    // give the BookingForm a moment to apply trip type
    setTimeout(() => {
      const el = document.getElementById("book") || document.getElementById("book-mobile");
      el && el.scrollIntoView({ behavior: "smooth", block: "start" });
      // dispatch custom event so forms can pre-fill from/to
      window.dispatchEvent(new CustomEvent("preset-route", { detail: { route, trip } }));
    }, 50);
  };

  return (
    <div className="bg-neutral-50">
      <Header />

      <div className="relative">
        <Hero />
        <div className="absolute right-5 sm:right-10 top-28 lg:top-36 w-[calc(100%-2.5rem)] sm:w-[calc(100%-5rem)] lg:w-[540px] xl:w-[580px] z-20 hidden md:block">
          <BookingFormWithPresets initialTripType={presetTrip} />
        </div>
      </div>

      <div className="md:hidden -mt-6 px-5 relative z-20" id="book-mobile">
        <BookingFormWithPresets variant="alt" initialTripType={presetTrip} />
      </div>

      <Fleet />
      <Routes onSelect={onPickRoute} />
      <PremiumFleet />
      <Services />
      <WhyUs />
      <Emergency />
      <ReadyToRide />
      <Reviews />
      <RateUs />
      <GetInTouch />
      <Footer />

      <a
        href={buildWhatsAppLink(`Hello! I want to book a car. ${WA_DOC_NOTE}`)}
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

// Wrapper that listens to "preset-route" event and rerenders BookingForm with new initialTripType
function BookingFormWithPresets({ variant = "hero", initialTripType }) {
  const [trip, setTrip] = useState(initialTripType);

  useEffect(() => {
    const handler = (e) => {
      setTrip(e.detail.trip);
    };
    window.addEventListener("preset-route", handler);
    return () => window.removeEventListener("preset-route", handler);
  }, []);

  useEffect(() => { setTrip(initialTripType); }, [initialTripType]);

  return <BookingForm variant={variant} initialTripType={trip} key={trip || variant} />;
}
