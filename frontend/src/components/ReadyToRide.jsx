import BookingForm from "@/components/BookingForm";
import { Phone, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, PHONE_DISPLAY, PHONE_TEL, WA_DOC_NOTE } from "@/lib/api";

export default function ReadyToRide() {
  return (
    <section
      id="ready"
      className="bg-amber-50 px-5 sm:px-10 py-20 sm:py-24"
      data-testid="ready-section"
    >
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-amber-600 font-semibold mb-3">
            Ready to Ride?
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight text-neutral-900">
            Book your journey <em className="text-amber-500 not-italic">today.</em>
          </h2>
          <p className="mt-4 text-neutral-700 max-w-lg">
            Choose your trip type, pick a car, and pay only 50% advance. The
            balance is collected after your ride is completed. WhatsApp us for
            instant booking.
          </p>

          <div className="mt-7 grid sm:grid-cols-2 gap-3 max-w-lg">
            <a
              href={`tel:${PHONE_TEL}`}
              className="bg-white p-5 rounded-2xl border border-amber-200 hover:border-amber-400 transition flex items-center gap-4"
              data-testid="ready-phone"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500 grid place-items-center text-white">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500">Call us</div>
                <div className="font-semibold text-neutral-900">{PHONE_DISPLAY}</div>
              </div>
            </a>
            <a
              href={buildWhatsAppLink(`Hello, I want to book a car. ${WA_DOC_NOTE}`)}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-5 rounded-2xl border border-emerald-200 hover:border-emerald-400 transition flex items-center gap-4"
              data-testid="ready-whatsapp"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 grid place-items-center text-white">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500">WhatsApp</div>
                <div className="font-semibold text-neutral-900">Instant reply, 24x7</div>
              </div>
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-amber-600 font-semibold mb-2">
            Quick Booking
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl mb-5 text-neutral-900">
            Book your ride in 60 seconds
          </h3>
          <BookingForm variant="alt" />
        </div>
      </div>
    </section>
  );
}
