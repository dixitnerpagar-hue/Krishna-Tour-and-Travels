import { useEffect, useState } from "react";
import { STANDARD_FLEET } from "@/data/cars";
import { Briefcase, Users, MessageCircle, AlertCircle } from "lucide-react";
import { buildWhatsAppLink, WA_DOC_NOTE, api, formatINR, DRIVER_ALLOWANCE_PER_DAY } from "@/lib/api";

export default function Fleet() {
  const [unavailable, setUnavailable] = useState({});

  useEffect(() => {
    api.get("/cars/availability").then(({ data }) => {
      const map = {};
      data.forEach((c) => { if (!c.available) map[c.car_name] = c.note || "Currently unavailable"; });
      setUnavailable(map);
    }).catch(() => {});
  }, []);

  return (
    <section
      id="fleet"
      className="px-5 sm:px-10 py-20 sm:py-24 max-w-[1500px] mx-auto"
      data-testid="fleet-section"
    >
      <div className="text-center mb-10">
        <div className="text-xs tracking-[0.25em] uppercase text-amber-600 font-semibold mb-3">
          Our Fleet
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-neutral-900">
          Pick your <em className="text-amber-500 not-italic">perfect ride</em>
        </h2>
        <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
          Hatchback se SUV tak — saaf, sanitised aur driver-trained gaadi. Pricing
          shown is for the round-trip pattern (300 km/day). Driver allowance &amp; toll
          extra apply for trips with driver.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {STANDARD_FLEET.map((car) => {
          const unavailNote = unavailable[car.name];
          return (
            <div
              key={car.name}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all group relative"
              data-testid={`car-card-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {unavailNote && (
                <div className="absolute top-3 left-3 right-3 z-10 bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full text-center flex items-center justify-center gap-1 shadow-lg">
                  <AlertCircle size={12} /> Currently booked
                </div>
              )}
              <div className={`relative h-48 bg-neutral-100 ${unavailNote ? "opacity-60" : ""}`}>
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-neutral-700">
                  {car.type}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-serif text-xl font-semibold text-neutral-900">{car.name}</h3>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {car.seats} Persons · {car.bags} Bags
                </div>

                {/* radhecab-style price block */}
                <div className="mt-4 flex items-baseline gap-2">
                  <div className="font-serif text-2xl font-bold text-blue-700">
                    Rs.{car.per_km}/km
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Round Trip · 300KM/day
                  </div>
                </div>
                <div className="mt-2 text-xs text-neutral-600">
                  Full Day: <b className="text-neutral-900">₹{formatINR(car.day)}</b>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-neutral-500">
                  <span>Driver Allowance: ₹{DRIVER_ALLOWANCE_PER_DAY}/day</span>
                  <span>Toll &amp; Parking Extra</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href="#book"
                    onClick={(e) => { if (unavailNote) { e.preventDefault(); } }}
                    className={`flex-1 text-center text-sm font-bold py-2.5 rounded-lg transition uppercase tracking-wider ${
                      unavailNote
                        ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                    data-testid={`rent-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    Rent This Car
                  </a>
                  <a
                    href={buildWhatsAppLink(`Hello, I'd like to book ${car.name} (₹${car.per_km}/km, ₹${car.day}/day). ${WA_DOC_NOTE}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 grid place-items-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                  >
                    <MessageCircle size={16} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
