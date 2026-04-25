import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Users,
  Car,
  Send,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  STANDARD_FLEET,
  PREMIUM_FLEET,
  TRIP_TYPES,
  ROUTES,
} from "@/data/cars";
import {
  api,
  buildWhatsAppLink,
  WA_DOC_NOTE,
  OFFICE,
  MAP_EMBED,
  SELF_DRIVE_DELIVERY_PER_KM,
} from "@/lib/api";

const ALL_FLEET_FOR_DROPDOWN = [
  ...STANDARD_FLEET.map((c) => ({ name: c.name, hint: `₹${c.per_km}/km · ₹${c.day}/day` })),
  ...PREMIUM_FLEET.map((c) => ({
    name: c.name,
    hint: `₹${c.per_km_min}-${c.per_km_max}/km · ₹${c.day_min}-${c.day_max}/day`,
  })),
];

export default function BookingForm({ variant = "hero", initialTripType }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    trip_type: initialTripType || "Car with Driver",
    car_name: "",
    pickup_location: "",
    drop_location: "",
    self_drive_option: "drop_at_location",
    self_drive_delivery_km: 0,
    pickup_date: "",
    drop_date: "",
    pickup_time: "",
    drop_time: "",
    duration_days: 1,
    name: "",
    phone: "",
    email: "",
    passengers: 2,
    notes: "",
    needs_negotiation: false,
  });

  useEffect(() => {
    if (initialTripType) setForm((p) => ({ ...p, trip_type: initialTripType }));
  }, [initialTripType]);

  const tripMeta = useMemo(
    () => TRIP_TYPES.find((t) => t.value === form.trip_type) || TRIP_TYPES[0],
    [form.trip_type]
  );

  // auto-flag negotiation when duration > 7
  useEffect(() => {
    setForm((p) => ({ ...p, needs_negotiation: (p.duration_days || 0) > 7 }));
  }, [form.duration_days]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const buildMessage = (b) => {
    let m = `Hello Krishn Tour and Travels — New Booking Request\n\n`;
    m += `Trip: ${b.trip_type}\n`;
    if (b.car_name) m += `Car: ${b.car_name}\n`;
    if (tripMeta.isSelfDrive) {
      m += `Option: ${
        b.self_drive_option === "drop_at_location"
          ? `Drop car at my location (₹${SELF_DRIVE_DELIVERY_PER_KM}/km delivery)`
          : "Pickup from your location"
      }\n`;
      if (b.self_drive_option === "drop_at_location" && b.pickup_location)
        m += `Address: ${b.pickup_location}\n`;
      if (b.self_drive_delivery_km)
        m += `Delivery distance: ${b.self_drive_delivery_km} km\n`;
    } else {
      if (b.pickup_location) m += `Pickup: ${b.pickup_location}\n`;
      if (b.drop_location) m += `Drop: ${b.drop_location}\n`;
    }
    if (b.pickup_date) m += `Pickup Date: ${b.pickup_date}\n`;
    if (b.drop_date) m += `Drop Date: ${b.drop_date}\n`;
    if (b.pickup_time) m += `Pickup Time: ${b.pickup_time}\n`;
    if (b.drop_time) m += `Drop Time: ${b.drop_time}\n`;
    if (b.duration_days) m += `Duration: ${b.duration_days} day(s)\n`;
    m += `Name: ${b.name}\nPhone: ${b.phone}\n`;
    if (b.email) m += `Email: ${b.email}\n`;
    m += `Passengers: ${b.passengers}\n`;
    if (b.notes) m += `Notes: ${b.notes}\n`;
    if (b.needs_negotiation)
      m += `\n📝 Booking is for >7 days — open to price negotiation.\n`;
    m += `\nNote: Driver allowance ₹300/day + Toll & Parking extra (for trips with driver).\n${WA_DOC_NOTE}`;
    return m;
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name";
    if (!form.phone.trim()) return "Please enter your phone number";
    if (tripMeta.needsDrop) {
      if (!form.pickup_location.trim()) return "Pickup location is required";
      if (!form.drop_location.trim()) return "Drop location is required";
    }
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return toast.error(err);
    setSubmitting(true);
    try {
      const { data } = await api.post("/bookings", form);
      toast.success("Booking received! Redirecting to payment...");
      navigate(`/booking/${data.id}`);
    } catch (e) {
      toast.error("Could not submit booking. Try WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendWhatsApp = async () => {
    const err = validate();
    if (err) return toast.error(err);
    try { await api.post("/bookings", form); } catch (e) {}
    window.open(buildWhatsAppLink(buildMessage(form)), "_blank");
  };

  const isHero = variant === "hero";
  const card = isHero
    ? "bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-5 sm:p-6 border border-white/40"
    : "bg-white shadow-xl rounded-2xl p-5 sm:p-7 border border-amber-100";

  return (
    <div className={card} id={isHero ? "book" : "book-2"} data-testid={`booking-form-${variant}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Trip Type" icon={<Car size={14} />}>
          <select
            value={form.trip_type}
            onChange={(e) => update("trip_type", e.target.value)}
            className="input-base"
            data-testid="trip-type-select"
          >
            {TRIP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.value}</option>
            ))}
          </select>
        </Field>
        <Field label="Select Car" icon={<Car size={14} />}>
          <select
            value={form.car_name}
            onChange={(e) => update("car_name", e.target.value)}
            className="input-base"
            data-testid="car-select"
          >
            <option value="">Choose a car</option>
            {ALL_FLEET_FOR_DROPDOWN.map((c) => (
              <option key={c.name} value={c.name}>{c.name} — {c.hint}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* Route presets for Round/One-way */}
      {tripMeta.isRoute && (
        <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-blue-700 mb-2">
            Quick-pick popular routes (or fill custom below)
          </div>
          <div className="flex flex-wrap gap-2">
            {ROUTES.map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                type="button"
                onClick={() => {
                  update("pickup_location", r.from);
                  update("drop_location", r.to);
                }}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-blue-100 border border-blue-200 text-blue-700 font-medium"
                data-testid={`route-${r.from}-${r.to}`}
              >
                {r.from} ⇌ {r.to} · ₹{r.sedan}+
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Self-drive options */}
      {tripMeta.isSelfDrive ? (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 mb-2">
            Pick-up Option
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <RadioCard
              checked={form.self_drive_option === "drop_at_location"}
              onChange={() => update("self_drive_option", "drop_at_location")}
              testid="opt-drop-at-location"
              title="Drop car at my location"
              hint={`Extra ₹${SELF_DRIVE_DELIVERY_PER_KM}/km delivery charge.`}
            />
            <RadioCard
              checked={form.self_drive_option === "pickup_from_us"}
              onChange={() => update("self_drive_option", "pickup_from_us")}
              testid="opt-pickup-from-us"
              title="Pick from our location"
              hint={OFFICE}
            />
          </div>

          {form.self_drive_option === "drop_at_location" ? (
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <Field label="Your Address" icon={<MapPin size={14} />}>
                <input
                  className="input-base"
                  placeholder="Where to deliver the car"
                  value={form.pickup_location}
                  onChange={(e) => update("pickup_location", e.target.value)}
                  data-testid="self-drive-address"
                />
              </Field>
              <Field label="Distance (km)" icon={<MapPin size={14} />}>
                <input
                  type="number"
                  min={0}
                  className="input-base"
                  placeholder="approx km from our office"
                  value={form.self_drive_delivery_km || ""}
                  onChange={(e) => update("self_drive_delivery_km", parseFloat(e.target.value) || 0)}
                  data-testid="self-drive-km"
                />
              </Field>
            </div>
          ) : (
            <div className="mt-3 rounded-lg overflow-hidden border border-amber-200 h-40">
              <iframe title="Pickup" src={MAP_EMBED} width="100%" height="100%" style={{ border: 0 }} loading="lazy" />
            </div>
          )}

          {form.trip_type === "Wedding/Marriage" && (
            <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex gap-2">
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <div><b>Note:</b> No decoration provided. Scratch / damage charges applicable as per assessment.</div>
            </div>
          )}
        </div>
      ) : tripMeta.value !== "Emergency" && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Pickup Location" icon={<MapPin size={14} />}>
            <input
              className="input-base"
              placeholder="e.g. Ahmedabad"
              value={form.pickup_location}
              onChange={(e) => update("pickup_location", e.target.value)}
              data-testid="pickup-location"
            />
          </Field>
          <Field label="Drop Location" icon={<MapPin size={14} />}>
            <input
              className="input-base"
              placeholder="e.g. Vadodara"
              value={form.drop_location}
              onChange={(e) => update("drop_location", e.target.value)}
              data-testid="drop-location"
            />
          </Field>
        </div>
      )}

      {/* Dates & Times */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field label="Pickup Date" icon={<Calendar size={14} />}>
          <input type="date" className="input-base" value={form.pickup_date}
            onChange={(e) => update("pickup_date", e.target.value)}
            data-testid="pickup-date" />
        </Field>
        <Field label="Drop Date" icon={<Calendar size={14} />}>
          <input type="date" className="input-base" value={form.drop_date}
            onChange={(e) => update("drop_date", e.target.value)}
            data-testid="drop-date" />
        </Field>
        <Field label="Pickup Time" icon={<Clock size={14} />}>
          <input type="time" className="input-base" value={form.pickup_time}
            onChange={(e) => update("pickup_time", e.target.value)}
            data-testid="pickup-time" />
        </Field>
        <Field label="Drop Time" icon={<Clock size={14} />}>
          <input type="time" className="input-base" value={form.drop_time}
            onChange={(e) => update("drop_time", e.target.value)}
            data-testid="drop-time" />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Duration (days)" icon={<Calendar size={14} />}>
          <input type="number" min={1} className="input-base" value={form.duration_days}
            onChange={(e) => update("duration_days", parseInt(e.target.value || "1"))}
            data-testid="duration-days" />
        </Field>
        <Field label="Passengers" icon={<Users size={14} />}>
          <input type="number" min={1} max={20} className="input-base" value={form.passengers}
            onChange={(e) => update("passengers", parseInt(e.target.value || "1"))}
            data-testid="passengers-input" />
        </Field>
        {form.needs_negotiation && (
          <div className="self-end p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
            🎉 Booking &gt;7 days — <b>price negotiation available</b>! We'll call you with our best offer.
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Your Name" icon={<User size={14} />}>
          <input className="input-base" placeholder="Full name" value={form.name}
            onChange={(e) => update("name", e.target.value)}
            data-testid="name-input" />
        </Field>
        <Field label="Phone Number" icon={<Phone size={14} />}>
          <input className="input-base" placeholder="+91 76004 91012" value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            data-testid="phone-input" />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Email (optional)" icon={<Mail size={14} />}>
          <input className="input-base" placeholder="you@example.com" value={form.email}
            onChange={(e) => update("email", e.target.value)}
            data-testid="email-input" />
        </Field>
        <Field label="Notes (optional)">
          <input className="input-base" placeholder="Special requests / stops"
            value={form.notes} onChange={(e) => update("notes", e.target.value)}
            data-testid="notes-input" />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={submit} disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-amber-500/30 transition"
          data-testid="submit-booking-btn">
          <Send size={16} /> {submitting ? "Submitting..." : "Submit & Pay 50% Advance"}
        </button>
        <button onClick={sendWhatsApp}
          className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition"
          data-testid="whatsapp-booking-btn">
          <MessageCircle size={16} /> Send on WhatsApp
        </button>
      </div>

      <p className="mt-2.5 text-[11px] text-neutral-500 text-center">
        50% advance now · 50% after the ride · Driver allowance ₹300/day + Toll & Parking extra
      </p>

      <style>{`
        .input-base {
          width: 100%; padding: 0.6rem 0.75rem;
          border: 1px solid #e5e1da; border-radius: 0.55rem;
          font-size: 0.85rem; background: white; outline: none;
          transition: all 0.15s;
        }
        .input-base:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15); }
      `}</style>
    </div>
  );
}

const Field = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-neutral-600 mb-1">
      {icon}{label}
    </label>
    {children}
  </div>
);

const RadioCard = ({ checked, onChange, title, hint, testid }) => (
  <label
    className={`flex gap-2.5 p-2.5 rounded-lg cursor-pointer border-2 transition ${
      checked ? "border-amber-500 bg-white" : "border-transparent bg-white/60"
    }`}
    data-testid={testid}
  >
    <input type="radio" checked={checked} onChange={onChange} className="mt-1" />
    <div>
      <div className="font-semibold text-sm">{title}</div>
      <div className="text-[11px] text-neutral-600 mt-0.5">{hint}</div>
    </div>
  </label>
);
