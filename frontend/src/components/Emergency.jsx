import { Zap, Phone, MessageCircle } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, buildWhatsAppLink, OWNER } from "@/lib/api";

export default function Emergency() {
  const msg = `🚨 Emergency Booking — I need a car urgently. Please share availability and price. (Owner: ${OWNER})`;
  return (
    <section
      id="emergency"
      className="bg-gradient-to-br from-red-600 via-red-500 to-amber-500 text-white px-5 sm:px-10 py-16 sm:py-20"
      data-testid="emergency-section"
    >
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-bold backdrop-blur-md mb-5">
          <Zap size={14} className="fill-white" /> Emergency Booking
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-medium leading-tight">
          Need a car <em className="text-amber-200 not-italic">right now?</em>
        </h2>
        <p className="mt-4 text-white/90 max-w-xl mx-auto">
          Last-minute travel? Medical? Late-night airport drop? Call the owner
          directly — we'll arrange a car &amp; discuss the price on call.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-3 bg-white text-red-600 px-7 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition"
            data-testid="emergency-call-btn"
          >
            <Phone size={20} className="fill-red-600" />
            Call Now: {PHONE_DISPLAY}
          </a>
          <a
            href={buildWhatsAppLink(msg)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-4 rounded-full font-bold transition"
            data-testid="emergency-wa-btn"
          >
            <MessageCircle size={20} />
            WhatsApp the Owner
          </a>
        </div>
        <div className="mt-5 text-xs text-white/80">
          Owner: <b>{OWNER}</b> · Response within minutes, 24×7.
        </div>
      </div>
    </section>
  );
}
