import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL,
  OFFICE,
  MAP_EMBED,
  buildWhatsAppLink,
} from "@/lib/api";

const cards = [
  {
    icon: <Phone size={20} />,
    label: "Phone",
    value: PHONE_DISPLAY,
    href: `tel:${PHONE_TEL}`,
    color: "bg-orange-500",
    test: "contact-phone",
  },
  {
    icon: <MessageCircle size={20} />,
    label: "WhatsApp",
    value: "Tap to chat",
    href: buildWhatsAppLink(
      "Hello! I want to know about your cars. Also Submit your Aadhar card and Driving Licence."
    ),
    color: "bg-emerald-500",
    test: "contact-whatsapp",
  },
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "bg-blue-500",
    test: "contact-email",
  },
  {
    icon: <MapPin size={20} />,
    label: "Office",
    value: OFFICE,
    href: "https://maps.google.com/?q=Vishwakarma+Institute+Of+Technology+Metro+Station+Pune",
    color: "bg-purple-500",
    test: "contact-office",
  },
  {
    icon: <Clock size={20} />,
    label: "Hours",
    value: "24 x 7 Available",
    href: "#",
    color: "bg-rose-500",
    test: "contact-hours",
  },
];

export default function GetInTouch() {
  return (
    <section
      id="contact"
      className="px-5 sm:px-10 py-20 sm:py-28 bg-neutral-50"
      data-testid="contact-section"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-3">
            Get in Touch
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
            Ek call, aapka safar{" "}
            <em className="text-orange-500 not-italic">shuru</em>.
          </h2>
          <p className="mt-5 text-neutral-700 max-w-2xl mx-auto">
            Aap kahin ho, kabhi bhi — hume call ya WhatsApp kariye. Hamari team
            24x7 aapke liye available hai.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-3">
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.label === "Office" ? "_blank" : undefined}
                rel="noreferrer"
                className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-orange-300 hover:-translate-y-1 transition-all flex items-start gap-4"
                data-testid={c.test}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${c.color} grid place-items-center text-white flex-shrink-0`}
                >
                  {c.icon}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-neutral-500">
                    {c.label}
                  </div>
                  <div className="font-semibold text-sm text-neutral-900 mt-0.5 break-all">
                    {c.value}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-neutral-200 h-80 lg:h-auto min-h-[320px]">
            <iframe
              title="Krishna Tour and Travels Office Map"
              src={MAP_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 380 }}
              loading="lazy"
              data-testid="contact-map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
