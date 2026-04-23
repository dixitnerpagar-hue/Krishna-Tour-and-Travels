import { ShieldCheck, BadgeCheck, HeadsetIcon, Sparkles } from "lucide-react";

const items = [
  {
    icon: <BadgeCheck size={28} />,
    title: "Transparent Pricing",
    desc: "No hidden charges. GPS-tracked billing with detailed trip summary.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Verified Drivers",
    desc: "Background checked, uniformed drivers with years of highway experience.",
  },
  {
    icon: <HeadsetIcon size={28} />,
    title: "24x7 Support",
    desc: "Talk to us any time — before, during or after your journey.",
  },
  {
    icon: <Sparkles size={28} />,
    title: "Well-Maintained Fleet",
    desc: "Clean, sanitised and serviced vehicles with working AC and safety kit.",
  },
];

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="px-5 sm:px-10 py-20 sm:py-28 max-w-[1500px] mx-auto"
      data-testid="why-us-section"
    >
      <div className="text-center mb-12">
        <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-3">
          Why Choose Us
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
          Built on trust, driven with{" "}
          <em className="text-orange-500 not-italic">pride</em>.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it) => (
          <div
            key={it.title}
            className="bg-white p-7 rounded-2xl border border-neutral-200 hover:border-orange-300 hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 grid place-items-center rounded-xl bg-orange-100 text-orange-600">
              {it.icon}
            </div>
            <h3 className="mt-5 font-serif text-xl font-semibold">{it.title}</h3>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              {it.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
