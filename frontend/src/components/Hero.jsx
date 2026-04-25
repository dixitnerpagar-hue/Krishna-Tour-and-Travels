import { ArrowDown, MessageCircle, Star, Zap } from "lucide-react";
import { buildWhatsAppLink, WA_DOC_NOTE } from "@/lib/api";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] w-full overflow-hidden"
      data-testid="hero-section"
    >
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400"
        alt="Scenic highway"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/65 to-blue-950/85" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 px-5 sm:px-10 pt-28 pb-20 max-w-[1500px] mx-auto">
        <div className="lg:col-span-7 text-white fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs sm:text-sm tracking-widest uppercase mb-7">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            Rated 4.9 by 12,000+ travellers
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-medium leading-[1.05] tracking-tight">
            Har safar ek{" "}
            <span className="italic text-amber-400">yaadgaar</span> kahaani.
          </h1>

          <p className="mt-5 font-serif italic text-xl sm:text-2xl text-amber-200/90">
            Your Comfort, Our Wheels.
          </p>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Round trips, one-way drops, self-drive, weddings &amp; airport transfers
            — Ahmedabad to anywhere in India. Transparent pricing, GPS-tracked
            billing, 50% advance &amp; balance after the ride.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#book"
              className="group inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-7 py-4 rounded-full font-semibold shadow-lg shadow-amber-500/30 transition-all"
              data-testid="hero-book-btn"
            >
              Book a Ride
              <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
            <a
              href={buildWhatsAppLink(`Hello Krishn Tour and Travels, I want to know about your cars. ${WA_DOC_NOTE}`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-4 rounded-full font-semibold transition-all"
              data-testid="hero-whatsapp-btn"
            >
              <MessageCircle size={18} />
              WhatsApp Booking
            </a>
            <a
              href="#emergency"
              className="inline-flex items-center gap-3 bg-red-500/90 hover:bg-red-600 text-white px-6 py-4 rounded-full font-semibold transition-all"
              data-testid="hero-emergency-btn"
            >
              <Zap size={18} className="fill-white" /> Emergency Booking
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl">
            {[
              ["15+", "Years Experience"],
              ["12K+", "Happy Customers"],
              ["50+", "Cities Covered"],
              ["4.9★", "Average Rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-3xl sm:text-4xl font-semibold">{n}</div>
                <div className="text-[10px] sm:text-xs tracking-[0.18em] uppercase text-white/70 mt-1">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5" id="book-anchor" />
      </div>
    </section>
  );
}
