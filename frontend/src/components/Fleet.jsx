import { useState } from "react";
import { CAR_CATEGORIES } from "@/data/cars";
import { Briefcase, Users, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/api";

export default function Fleet() {
  const [active, setActive] = useState(CAR_CATEGORIES[0].id);
  const cat = CAR_CATEGORIES.find((c) => c.id === active);

  return (
    <section
      id="fleet"
      className="px-5 sm:px-10 py-20 sm:py-28 max-w-[1500px] mx-auto"
      data-testid="fleet-section"
    >
      <div className="text-center mb-10">
        <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-3">
          Our Fleet
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
          Pick your <em className="text-orange-500 not-italic">perfect ride</em>
        </h2>
        <p className="mt-5 text-neutral-600 max-w-2xl mx-auto">
          Hatchback ho ya MUV — har safar ke liye saaf, sanitised aur
          driver-trained gaadi. Premium fleet for premium journeys.
        </p>
      </div>

      <div className="flex justify-center flex-wrap gap-2 mb-10">
        {CAR_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border ${
              active === c.id
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-orange-400"
            }`}
            data-testid={`fleet-tab-${c.id}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl text-neutral-800">{cat.title} Cars</h3>
        <div className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
          {cat.subtitle}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cat.cars.map((car) => (
          <div
            key={car.name}
            className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all group"
            data-testid={`car-card-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
          >
            <div className="relative h-44 overflow-hidden bg-neutral-100">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-neutral-700">
                {car.type}
              </span>
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                ₹{car.per_km}/km
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-serif text-xl font-semibold">{car.name}</h4>
              <div className="mt-3 flex gap-4 text-xs text-neutral-600">
                <span className="flex items-center gap-1">
                  <Users size={12} /> {car.seats} Seats
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase size={12} /> {car.bags} Bags
                </span>
                <span className="ml-auto font-semibold text-neutral-900">
                  ₹{car.per_day}/day
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {car.features.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <a
                  href="#book"
                  className="flex-1 text-center text-sm font-semibold bg-neutral-900 text-white py-2.5 rounded-lg hover:bg-neutral-800 transition"
                  data-testid={`book-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  Book Now
                </a>
                <a
                  href={buildWhatsAppLink(
                    `Hello, I'd like to book ${car.name} (₹${car.per_km}/km). Please share availability. Also Submit your Aadhar card and Driving Licence.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 grid place-items-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
