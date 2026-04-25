import { useState } from "react";
import { MapPin, ArrowLeftRight, Car as CarIcon } from "lucide-react";
import { ROUTES } from "@/data/cars";
import { formatINR } from "@/lib/api";

export default function Routes({ onSelect }) {
  const [tab, setTab] = useState("oneway"); // 'oneway' | 'round'

  return (
    <section
      id="routes"
      className="bg-sky-50 px-5 sm:px-10 py-20 sm:py-24"
      data-testid="routes-section"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-8">
          <div className="text-xs tracking-[0.25em] uppercase text-blue-700 font-semibold mb-3">
            Popular Routes
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-neutral-900">
            Oneway &amp; <em className="text-blue-700 not-italic">Round Trips</em>
          </h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Pick a popular route below — or add a custom destination in the booking
            form. Driver allowance + toll &amp; parking are extra for all routes.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[
            ["round",  "Round Trip"],
            ["oneway", "One-Way Trip"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition border ${
                tab === k
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-blue-700 border-blue-200 hover:border-blue-500"
              }`}
              data-testid={`routes-tab-${k}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROUTES.map((r) => (
            <div
              key={`${r.from}-${r.to}`}
              className="bg-white border border-blue-200 rounded-2xl p-5 hover:shadow-lg transition"
              data-testid={`route-card-${r.from}-${r.to}`}
            >
              <div className="flex items-center gap-2 text-red-500">
                <MapPin size={16} className="fill-red-500" />
                <div className="text-[10px] uppercase tracking-widest font-bold text-neutral-500">
                  {tab === "round" ? "Round Trip" : "One-Way"}
                </div>
              </div>
              <h3 className="mt-1 font-serif text-2xl font-bold text-blue-800 flex items-center gap-2">
                {r.from} <ArrowLeftRight size={16} className="text-blue-400" /> {r.to}
              </h3>

              <div className="mt-4 pt-3 border-t border-blue-100">
                <div className="text-sm text-neutral-700">
                  Starting from: <b className="text-blue-700 text-base">₹{formatINR(r.sedan)}</b>
                </div>
                <div className="mt-2 text-xs">
                  <div className="font-bold text-neutral-700 mb-1">Fleet Options:</div>
                  <div className="flex justify-between">
                    <span>Sedan:</span><b>₹{formatINR(r.sedan)}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>SUV:</span><b>₹{formatINR(r.suv)}</b>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelect && onSelect(r, tab === "round" ? "Round Trip" : "One-Way Trip")}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition"
                data-testid={`book-route-${r.from}-${r.to}`}
              >
                <CarIcon size={14} /> Book Your Cab
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-xs text-neutral-500">
          📝 Don't see your route? Just enter pickup &amp; drop in the booking form — we cover all of India.
        </div>
      </div>
    </section>
  );
}
