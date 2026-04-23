import { ArrowDown, MessageCircle, Star } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/api";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden"
      data-testid="hero-section"
    >
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400"
        alt="Scenic highway"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 px-5 sm:px-10 pt-32 pb-20 max-w-[1500px] mx-auto">
        <div className="lg:col-span-7 text-white fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs sm:text-sm tracking-widest uppercase mb-8">
            <Star size={14} className="fill-orange-400 text-orange-400" />
            Rated 4.9 by 12,000+ travellers
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-medium leading-[1.05] tracking-tight">
            Har safar ek{" "}
            <span className="italic text-orange-400">yaadgaar</span> kahaani.
          </h1>

          <p className="mt-6 font-serif italic text-xl sm:text-2xl text-orange-200/90">
            Your Comfort, Our Wheels.
          </p>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            From Pune ki galiyon se Mumbai ki sadkon tak — Krishna Tour &amp;
            Travels delivers premium Hatchback, Sedan, SUV &amp; MUV rides with
            trusted drivers and transparent pricing.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#book"
              className="group inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-full font-semibold shadow-lg shadow-orange-500/30 transition-all"
              data-testid="hero-book-btn"
            >
              Book a Ride
              <ArrowDown
                size={18}
                className="group-hover:translate-y-1 transition-transform"
              />
            </a>
            <a
              href={buildWhatsAppLink(
                "Hello Krishna Tour and Travels, I want to know about your cars. Also Submit your Aadhar card and Driving Licence."
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-7 py-4 rounded-full font-semibold transition-all"
              data-testid="hero-whatsapp-btn"
            >
              <MessageCircle size={18} />
              WhatsApp Booking
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl">
            {[
              ["15+", "Years Experience"],
              ["12K+", "Happy Customers"],
              ["50+", "Cities Covered"],
              ["4.9★", "Average Rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-3xl sm:text-4xl font-semibold">
                  {n}
                </div>
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
