import { Phone, MessageCircle, Mail, MapPin, Clock, User } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, OFFICE, OWNER, MAP_EMBED, buildWhatsAppLink, WA_DOC_NOTE } from "@/lib/api";

const cards = [
  { icon: <Phone size={20} />, label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, color: "bg-amber-500", test: "contact-phone" },
  { icon: <MessageCircle size={20} />, label: "WhatsApp", value: "Tap to chat", href: buildWhatsAppLink(`Hello! I want to know about your cars. ${WA_DOC_NOTE}`), color: "bg-emerald-500", test: "contact-whatsapp" },
  { icon: <Mail size={20} />, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, color: "bg-blue-500", test: "contact-email" },
  { icon: <User size={20} />, label: "Owner", value: OWNER, href: `tel:${PHONE_TEL}`, color: "bg-purple-500", test: "contact-owner" },
  { icon: <MapPin size={20} />, label: "Office", value: OFFICE, href: "https://maps.google.com/?q=Ahmedabad+Gujarat", color: "bg-rose-500", test: "contact-office" },
  { icon: <Clock size={20} />, label: "Hours", value: "24 x 7 Available", href: "#", color: "bg-neutral-700", test: "contact-hours" },
];

export default function GetInTouch() {
  return (
    <section
      id="contact"
      className="px-5 sm:px-10 py-20 sm:py-24 bg-neutral-50"
      data-testid="contact-section"
    >
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.25em] uppercase text-amber-600 font-semibold mb-3">
            Get in Touch
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-neutral-900">
            Ek call, aapka safar <em className="text-amber-500 not-italic">shuru</em>.
          </h2>
          <p className="mt-4 text-neutral-700 max-w-2xl mx-auto">
            Aap kahin bhi ho — call ya WhatsApp kariye. Owner Pankaj Gemita aur team
            24×7 aapke liye available hain.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-7">
          <div className="lg:col-span-5 grid sm:grid-cols-2 gap-3">
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.label === "Office" ? "_blank" : undefined}
                rel="noreferrer"
                className="bg-white p-5 rounded-2xl border border-neutral-200 hover:border-amber-300 hover:-translate-y-1 transition-all flex items-start gap-4"
                data-testid={c.test}
              >
                <div className={`w-11 h-11 rounded-xl ${c.color} grid place-items-center text-white flex-shrink-0`}>
                  {c.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-neutral-500">{c.label}</div>
                  <div className="font-semibold text-sm text-neutral-900 mt-0.5 truncate">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-neutral-200 h-80 lg:h-auto min-h-[360px]">
            <iframe
              title="Krishn Tour and Travels Map"
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
