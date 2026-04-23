import BookingForm from "@/components/BookingForm";
import { Phone, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, PHONE_DISPLAY, PHONE_TEL } from "@/lib/api";

export default function ReadyToRide() {
  return (
    <section
      id="ready"
      className="bg-orange-50 px-5 sm:px-10 py-20 sm:py-28"
      data-testid="ready-section"
    >
      <div className="max-w-[1500px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-3">
            Ready to Ride?
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
            Book your journey{" "}
            <em className="text-orange-500 not-italic">today.</em>
          </h2>
          <p className="mt-5 text-neutral-700 max-w-lg">
            Select your dates, choose your car, and leave the rest to us. You can
            also directly send the booking on WhatsApp — we'll confirm within
            minutes.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-lg">
            <a
              href={`tel:${PHONE_TEL}`}
              className="bg-white p-5 rounded-2xl border border-orange-200 hover:border-orange-400 transition flex items-center gap-4"
              data-testid="ready-phone"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500 grid place-items-center text-white">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500">
                  Call us
                </div>
                <div className="font-semibold text-neutral-900">
                  {PHONE_DISPLAY}
                </div>
              </div>
            </a>
            <a
              href={buildWhatsAppLink(
                "Hello, I want to book a car. Also Submit your Aadhar card and Driving Licence."
              )}
              target="_blank"
              rel="noreferrer"
              className="bg-white p-5 rounded-2xl border border-emerald-200 hover:border-emerald-400 transition flex items-center gap-4"
              data-testid="ready-whatsapp"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 grid place-items-center text-white">
                <MessageCircle size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500">
                  WhatsApp
                </div>
                <div className="font-semibold text-neutral-900">
                  Instant reply, 24x7
                </div>
              </div>
            </a>
          </div>
        </div>

        <div>
          <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-2">
            Quick Booking
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl mb-5">
            Book your ride in 60 seconds
          </h3>
          <BookingForm variant="alt" />
        </div>
      </div>
    </section>
  );
}
