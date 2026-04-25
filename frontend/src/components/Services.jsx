import { SERVICES } from "@/data/cars";

export default function Services() {
  return (
    <section
      id="services"
      className="bg-neutral-950 text-white px-5 sm:px-10 py-20 sm:py-28"
      data-testid="services-section"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.25em] uppercase text-orange-400 font-semibold mb-3">
            Our Services
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
            Safar ho ya <em className="text-orange-400 not-italic">utsav</em>,
            hum saath hain.
          </h2>
          <p className="mt-5 text-white/70 max-w-2xl mx-auto">
            Wedding se corporate tak, airport se outstation tak — Krishn Tour and Travels
            delivers reliable, premium mobility for every occasion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className={`relative rounded-3xl overflow-hidden border border-white/10 group ${
                i === 0 ? "lg:row-span-2 lg:h-auto" : ""
              }`}
              data-testid={`service-${s.title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div className={i === 0 ? "h-[480px]" : "h-72"}>
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-2xl font-semibold">{s.title}</h3>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
