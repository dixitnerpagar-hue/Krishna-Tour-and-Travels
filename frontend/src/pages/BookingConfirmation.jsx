import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  CreditCard,
  FileText,
  Upload,
  MessageCircle,
  Home as HomeIcon,
  AlertCircle,
} from "lucide-react";
import { api, buildWhatsAppLink, PHONE_DISPLAY } from "@/lib/api";

const SELF_DRIVE_TRIPS = ["Self Drive Car", "Wedding/Marriage"];

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("payment"); // payment | documents | done

  useEffect(() => {
    api
      .get(`/bookings/${id}`)
      .then(({ data }) => setBooking(data))
      .catch(() => setBooking(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-neutral-500">
        Loading…
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen grid place-items-center px-5">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
          <div className="font-serif text-2xl">Booking not found</div>
          <Link
            to="/"
            className="mt-5 inline-block bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const requiresDocs = SELF_DRIVE_TRIPS.includes(booking.trip_type);

  const buildDocsMessage = () => {
    let m = `These are my documents — Aadhar Card & Driving Licence\n\n`;
    m += `Booking ID: ${booking.id}\n`;
    m += `Name: ${booking.name}\n`;
    m += `Phone: ${booking.phone}\n`;
    m += `Trip: ${booking.trip_type}\n`;
    if (booking.car_name) m += `Car: ${booking.car_name}\n`;
    if (booking.pickup_date) m += `Date: ${booking.pickup_date}\n`;
    return m;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-neutral-50 px-5 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-orange-600 mb-6"
        >
          <HomeIcon size={14} /> Back to home
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 p-6 border-b border-neutral-100 bg-neutral-50">
            <Step active={step === "payment"} done={step !== "payment"} num={1} label="Payment" />
            <div className="h-px flex-1 max-w-12 bg-neutral-300" />
            <Step
              active={step === "documents"}
              done={step === "done"}
              num={2}
              label="Documents"
            />
            <div className="h-px flex-1 max-w-12 bg-neutral-300" />
            <Step active={step === "done"} done={false} num={3} label="Done" />
          </div>

          <div className="p-6 sm:p-10">
            {/* Booking summary */}
            <div className="mb-7 p-5 rounded-2xl bg-orange-50 border border-orange-100">
              <div className="flex items-center gap-2 text-orange-700 font-semibold text-sm mb-3">
                <CheckCircle2 size={16} /> Booking received
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <Row k="Booking ID" v={booking.id.slice(0, 8).toUpperCase()} />
                <Row k="Trip Type" v={booking.trip_type} />
                <Row k="Name" v={booking.name} />
                <Row k="Phone" v={booking.phone} />
                {booking.car_name && <Row k="Car" v={booking.car_name} />}
                {booking.pickup_date && <Row k="Date" v={booking.pickup_date} />}
                {booking.pickup_time && <Row k="Pickup Time" v={booking.pickup_time} />}
                {booking.drop_time && <Row k="Drop Time" v={booking.drop_time} />}
                {booking.pickup_location && (
                  <Row k="Pickup" v={booking.pickup_location} />
                )}
                {booking.drop_location && <Row k="Drop" v={booking.drop_location} />}
              </div>
            </div>

            {step === "payment" && (
              <div data-testid="payment-step">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500 text-white grid place-items-center">
                    <CreditCard size={22} />
                  </div>
                  <h2 className="font-serif text-2xl">Confirm &amp; Pay</h2>
                </div>
                <p className="text-sm text-neutral-600 mb-5">
                  We'll confirm your booking on call/WhatsApp shortly. Pay an advance
                  to lock your slot — full payment can be done after the ride.
                </p>

                {requiresDocs && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                    <AlertCircle
                      size={18}
                      className="text-amber-600 flex-shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-amber-900">
                      <strong>Important:</strong> Aadhar Card and Driving Licence
                      must be submitted in the next step (required for{" "}
                      {booking.trip_type}).
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <PaymentBtn label="Pay Advance ₹500" />
                  <PaymentBtn label="Pay Full" outline />
                </div>

                <button
                  onClick={() =>
                    setStep(requiresDocs ? "documents" : "done")
                  }
                  className="mt-5 w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition"
                  data-testid="continue-after-payment"
                >
                  {requiresDocs ? "Continue to Documents" : "Finish Booking"}
                </button>

                <div className="mt-3 text-center text-xs text-neutral-500">
                  Or call us at {PHONE_DISPLAY} to pay over phone
                </div>
              </div>
            )}

            {step === "documents" && (
              <div data-testid="documents-step">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white grid place-items-center">
                    <FileText size={22} />
                  </div>
                  <h2 className="font-serif text-2xl">
                    Submit Aadhar Card &amp; Driving Licence
                  </h2>
                </div>
                <p className="text-sm text-neutral-600 mb-5">
                  Please send clear photos of your Aadhar Card and Driving Licence
                  on WhatsApp. This is required for {booking.trip_type}. Once
                  verified, your booking will be confirmed.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <DocCard title="Aadhar Card" />
                  <DocCard title="Driving Licence" />
                </div>

                <a
                  href={buildWhatsAppLink(buildDocsMessage())}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setTimeout(() => setStep("done"), 800)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition"
                  data-testid="submit-docs-whatsapp"
                >
                  <MessageCircle size={18} /> Submit Documents on WhatsApp
                </a>

                <button
                  onClick={() => setStep("payment")}
                  className="mt-3 w-full text-xs text-neutral-500 hover:text-neutral-800"
                >
                  ← back to payment
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-6" data-testid="done-step">
                <div className="w-20 h-20 rounded-full bg-emerald-100 grid place-items-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="font-serif text-3xl">All set!</h2>
                <p className="mt-3 text-neutral-600 max-w-md mx-auto">
                  We've recorded your booking. Our team will reach out on WhatsApp
                  / call to confirm shortly.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full font-semibold transition"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Step = ({ active, done, num, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
        done
          ? "bg-emerald-500 text-white"
          : active
          ? "bg-orange-500 text-white"
          : "bg-neutral-200 text-neutral-500"
      }`}
    >
      {done ? <CheckCircle2 size={16} /> : num}
    </div>
    <span
      className={`text-xs sm:text-sm font-semibold ${
        active || done ? "text-neutral-900" : "text-neutral-400"
      }`}
    >
      {label}
    </span>
  </div>
);

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-2 border-b border-orange-200/50 py-1">
    <span className="text-neutral-600">{k}</span>
    <span className="font-semibold text-neutral-900 text-right">{v}</span>
  </div>
);

const PaymentBtn = ({ label, outline }) => (
  <button
    className={`py-3 rounded-xl font-semibold text-sm transition ${
      outline
        ? "border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
        : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/30"
    }`}
    onClick={() => alert("Payment gateway integration coming soon. For now please pay via UPI to 9913258261.")}
  >
    {label}
  </button>
);

const DocCard = ({ title }) => (
  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-5 text-center hover:border-orange-400 transition cursor-pointer">
    <Upload size={22} className="mx-auto text-neutral-400 mb-2" />
    <div className="font-semibold text-sm">{title}</div>
    <div className="text-[11px] text-neutral-500 mt-1">
      Send via WhatsApp button below
    </div>
  </div>
);
