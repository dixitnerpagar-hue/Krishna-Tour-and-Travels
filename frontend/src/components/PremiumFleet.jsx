import { PREMIUM_FLEET } from "@/data/cars";
import { Crown, MessageCircle, Users, Briefcase } from "lucide-react";
import { buildWhatsAppLink, WA_DOC_NOTE, formatINR } from "@/lib/api";

export default function PremiumFleet() {
  return (
    <section
      id="premium"
      className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-blue-950 text-white px-5 sm:px-10 py-20 sm:py-24"
      data-testid="premium-section"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold mb-3">
            <Crown size={14} className="fill-amber-400" /> Luxury Collection
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
            For when only the <em className="text-amber-400 not-italic">finest</em> will do.
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Mercedes, BMW, Audi &amp; Fortuner — for weddings, VIP transfers, corporate events.
            Chauffeur-driven only. Decoration not included; scratch / damage charges apply.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PREMIUM_FLEET.map((car) => (
            <div
              key={car.name}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/50 transition-all group"
              data-testid={`premium-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className="h-44 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-semibold">{car.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                </div>
                <div className="mt-1 text-xs text-white/60">
                  <Users size={11} className="inline mr-1" /> {car.seats}
                  <Briefcase size={11} className="inline ml-3 mr-1" /> {car.bags}
                </div>

                <div className="mt-4 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-white/50">Per KM</div>
                  <div className="font-serif text-xl text-amber-400">
                    ₹{car.per_km_min} – ₹{car.per_km_max}
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-[11px] uppercase tracking-wider text-white/50">Per Day</div>
                  <div className="font-serif text-lg">
                    ₹{formatINR(car.day_min)} – ₹{formatINR(car.day_max)}
                  </div>
                </div>

                <a
                  href={buildWhatsAppLink(`Hello, I'd like to book the ${car.name} (Premium). Please share availability and exact pricing. ${WA_DOC_NOTE}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 py-2.5 rounded-lg text-sm font-bold transition"
                >
                  <MessageCircle size={14} /> Enquire on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
