import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2, CreditCard, FileText, Upload, MessageCircle,
  Home as HomeIcon, AlertCircle, Copy, Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { api, buildWhatsAppLink, PHONE_DISPLAY, formatINR } from "@/lib/api";

const SELF_DRIVE_TRIPS = ["Self Drive Car", "Wedding/Marriage"];

export default function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [config, setConfig] = useState({ razorpay_enabled: false, upi_id: "7600491012@upi" });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("payment");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/bookings/${id}`).then((r) => r.data).catch(() => null),
      api.get("/config").then((r) => r.data).catch(() => ({})),
    ]).then(([b, c]) => {
      setBooking(b);
      setConfig(c);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen grid place-items-center text-neutral-500">Loading…</div>;

  if (!booking) {
    return (
      <div className="min-h-screen grid place-items-center px-5">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
          <div className="font-serif text-2xl">Booking not found</div>
          <Link to="/" className="mt-5 inline-block bg-amber-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold">Back to home</Link>
        </div>
      </div>
    );
  }

  const requiresDocs = SELF_DRIVE_TRIPS.includes(booking.trip_type);
  const total = booking.estimated_total || 5000;
  const advance = Math.round(total * 0.5);

  const buildDocsMessage = () => {
    let m = `These are my documents — Aadhar Card & Driving Licence\n\n`;
    m += `Booking ID: ${booking.id.slice(0, 8).toUpperCase()}\n`;
    m += `Name: ${booking.name}\nPhone: ${booking.phone}\nTrip: ${booking.trip_type}\n`;
    if (booking.car_name) m += `Car: ${booking.car_name}\n`;
    if (booking.pickup_date) m += `Date: ${booking.pickup_date}\n`;
    return m;
  };

  const startPayment = async () => {
    setPaying(true);
    try {
      const { data } = await api.post("/payments/create-order", {
        booking_id: booking.id,
        amount_inr: advance,
      });
      if (data.method === "razorpay") {
        openRazorpay(data);
      } else {
        // UPI fallback - show UPI section
        toast.info("Pay via UPI below, then click 'I have paid'");
        setStep("upi");
      }
    } catch (e) {
      toast.error("Could not start payment");
    } finally {
      setPaying(false);
    }
  };

  const openRazorpay = (order) => {
    const loadScript = () => new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
    loadScript().then((ok) => {
      if (!ok) { toast.error("Could not load Razorpay"); return; }
      const rzp = new window.Razorpay({
        key: order.key_id,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Krishn Tour and Travels",
        description: `Advance for ${booking.trip_type}`,
        order_id: order.order_id,
        prefill: { name: booking.name, contact: booking.phone, email: booking.email || "" },
        theme: { color: "#f59e0b" },
        handler: async (resp) => {
          try {
            await api.post("/payments/verify", {
              booking_id: booking.id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            toast.success("Advance paid successfully!");
            setStep(requiresDocs ? "documents" : "done");
          } catch (e) {
            toast.error("Payment verification failed");
          }
        },
      });
      rzp.open();
    });
  };

  const confirmUpiPaid = async () => {
    try {
      await api.post("/payments/upi-notify", { booking_id: booking.id, amount: advance });
      toast.success("Recorded! We'll verify with bank shortly.");
      setStep(requiresDocs ? "documents" : "done");
    } catch (e) {
      toast.error("Could not record. Try again.");
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(config.upi_id);
    toast.success("UPI ID copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-neutral-50 px-5 py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-amber-600 mb-6">
          <HomeIcon size={14} /> Back to home
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center justify-center gap-3 sm:gap-6 p-6 border-b border-neutral-100 bg-neutral-50">
            <Step active={step === "payment" || step === "upi"} done={step === "documents" || step === "done"} num={1} label="Payment 50%" />
            <div className="h-px flex-1 max-w-12 bg-neutral-300" />
            <Step active={step === "documents"} done={step === "done"} num={2} label="Documents" />
            <div className="h-px flex-1 max-w-12 bg-neutral-300" />
            <Step active={step === "done"} done={false} num={3} label="Done" />
          </div>

          <div className="p-6 sm:p-9">
            <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm mb-3">
                <CheckCircle2 size={16} /> Booking received
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <Row k="Booking ID" v={booking.id.slice(0, 8).toUpperCase()} />
                <Row k="Trip Type" v={booking.trip_type} />
                <Row k="Name" v={booking.name} />
                <Row k="Phone" v={booking.phone} />
                {booking.car_name && <Row k="Car" v={booking.car_name} />}
                {booking.pickup_date && <Row k="Pickup Date" v={booking.pickup_date} />}
                {booking.drop_date && <Row k="Drop Date" v={booking.drop_date} />}
                {booking.pickup_time && <Row k="Pickup Time" v={booking.pickup_time} />}
                {booking.drop_time && <Row k="Drop Time" v={booking.drop_time} />}
                {booking.pickup_location && <Row k="Pickup" v={booking.pickup_location} />}
                {booking.drop_location && <Row k="Drop" v={booking.drop_location} />}
                {booking.duration_days && <Row k="Duration" v={`${booking.duration_days} day(s)`} />}
              </div>
              {booking.needs_negotiation && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[12px] text-emerald-800">
                  🎉 Booking &gt;7 days — we'll call you to negotiate the best price!
                </div>
              )}
            </div>

            {(step === "payment") && (
              <div data-testid="payment-step">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white grid place-items-center"><CreditCard size={22} /></div>
                  <h2 className="font-serif text-2xl">Pay 50% Advance</h2>
                </div>
                <p className="text-sm text-neutral-600 mb-4">
                  Pay <b>₹{formatINR(advance)}</b> now to lock your booking. The remaining 50%
                  (₹{formatINR(total - advance)}) is paid <b>after</b> the ride is completed.
                </p>

                {requiresDocs && (
                  <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                      <strong>Important:</strong> Aadhar Card and Driving Licence must be submitted
                      in the next step (required for {booking.trip_type}).
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={startPayment}
                    disabled={paying}
                    className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold shadow-md shadow-amber-500/30 transition flex items-center justify-center gap-2"
                    data-testid="pay-advance-btn"
                  >
                    <CreditCard size={16} /> {paying ? "Loading..." : `Pay ₹${formatINR(advance)} Advance`}
                  </button>
                  <button
                    onClick={() => setStep("upi")}
                    className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    data-testid="pay-upi-btn"
                  >
                    <Smartphone size={16} /> Pay via UPI
                  </button>
                </div>

                <button
                  onClick={() => setStep(requiresDocs ? "documents" : "done")}
                  className="mt-3 w-full text-xs text-neutral-500 hover:text-neutral-800 underline"
                  data-testid="skip-payment"
                >
                  Pay later (skip for now)
                </button>

                <div className="mt-4 text-center text-xs text-neutral-500">
                  Or call us at {PHONE_DISPLAY} to pay over phone
                </div>
              </div>
            )}

            {step === "upi" && (
              <div data-testid="upi-step">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white grid place-items-center"><Smartphone size={22} /></div>
                  <h2 className="font-serif text-2xl">Pay via UPI</h2>
                </div>
                <p className="text-sm text-neutral-600 mb-4">
                  Pay <b>₹{formatINR(advance)}</b> to the UPI ID below, then click "I have paid".
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-4">
                  <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold">UPI ID</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="font-mono text-2xl font-bold text-blue-900">{config.upi_id}</div>
                    <button onClick={copyUpi} className="ml-auto p-2 bg-white rounded-lg border border-blue-200 hover:bg-blue-100" title="Copy">
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="mt-3 text-sm">
                    Amount: <b className="text-blue-800">₹{formatINR(advance)}</b>
                  </div>
                  <div className="mt-2 text-xs text-blue-700">
                    Use any UPI app: GPay, PhonePe, Paytm, BHIM, etc.
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    onClick={confirmUpiPaid}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                    data-testid="upi-paid-btn"
                  >
                    <CheckCircle2 size={16} /> I have paid
                  </button>
                  <button onClick={() => setStep("payment")} className="border-2 border-neutral-300 text-neutral-700 py-3.5 rounded-xl font-semibold hover:bg-neutral-50">
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {step === "documents" && (
              <div data-testid="documents-step">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white grid place-items-center"><FileText size={22} /></div>
                  <h2 className="font-serif text-2xl">Submit Aadhar &amp; Driving Licence</h2>
                </div>
                <p className="text-sm text-neutral-600 mb-5">
                  Send clear photos of both documents on WhatsApp. Required for {booking.trip_type}.
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
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-md shadow-emerald-500/30 transition"
                  data-testid="submit-docs-whatsapp"
                >
                  <MessageCircle size={18} /> Submit Documents on WhatsApp
                </a>
                <button onClick={() => setStep("payment")} className="mt-3 w-full text-xs text-neutral-500 hover:text-neutral-800">
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
                  We've recorded your booking. Pankaj will call you within minutes
                  on <b>{booking.phone}</b> to confirm.
                </p>
                <Link to="/" className="mt-6 inline-block bg-amber-500 hover:bg-amber-600 text-white px-7 py-3 rounded-full font-semibold transition">
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
    <div className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold ${
      done ? "bg-emerald-500 text-white" : active ? "bg-amber-500 text-white" : "bg-neutral-200 text-neutral-500"
    }`}>
      {done ? <CheckCircle2 size={16} /> : num}
    </div>
    <span className={`text-xs sm:text-sm font-semibold ${active || done ? "text-neutral-900" : "text-neutral-400"}`}>
      {label}
    </span>
  </div>
);

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-2 border-b border-amber-200/50 py-1">
    <span className="text-neutral-600">{k}</span>
    <span className="font-semibold text-neutral-900 text-right">{v}</span>
  </div>
);

const DocCard = ({ title }) => (
  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-5 text-center hover:border-amber-400 transition">
    <Upload size={22} className="mx-auto text-neutral-400 mb-2" />
    <div className="font-semibold text-sm">{title}</div>
    <div className="text-[11px] text-neutral-500 mt-1">Send via WhatsApp button below</div>
  </div>
);
