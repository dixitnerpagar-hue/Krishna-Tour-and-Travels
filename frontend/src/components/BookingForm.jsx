import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Phone, Mail, Users, Car, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { ALL_CARS, TRIP_TYPES } from "@/data/cars";
import { api, buildWhatsAppLink, OFFICE, MAP_EMBED } from "@/lib/api";

export default function BookingForm({ variant = "hero" }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    trip_type: "Car with Driver",
    car_name: "",
    pickup_location: "",
    drop_location: "",
    self_drive_option: "drop_at_location",
    pickup_date: "",
    pickup_time: "",
    drop_time: "",
    name: "",
    phone: "",
    email: "",
    passengers: 2,
    notes: "",
  });

  const tripMeta = useMemo(
    () => TRIP_TYPES.find((t) => t.value === form.trip_type) || TRIP_TYPES[0],
    [form.trip_type]
  );

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const buildMessage = (b) => {
    let m = `Hello Krishna Tour and Travels — New Booking\n\n`;
    m += `Trip: ${b.trip_type}\n`;
    if (b.car_name) m += `Car: ${b.car_name}\n`;
    if (tripMeta.isSelfDrive) {
      m += `Option: ${b.self_drive_option === "drop_at_location" ? "Drop car at my location" : "Pick from your location"}\n`;
      if (b.self_drive_option === "drop_at_location" && b.pickup_location)
        m += `Drop Address: ${b.pickup_location}\n`;
    } else {
      if (b.pickup_location) m += `Pickup: ${b.pickup_location}\n`;
      if (b.drop_location) m += `Drop: ${b.drop_location}\n`;
    }
    if (b.pickup_date) m += `Date: ${b.pickup_date}\n`;
    if (b.pickup_time) m += `Pickup Time: ${b.pickup_time}\n`;
    if (b.drop_time) m += `Drop Time: ${b.drop_time}\n`;
    m += `Name: ${b.name}\nPhone: ${b.phone}\n`;
    if (b.email) m += `Email: ${b.email}\n`;
    m += `Passengers: ${b.passengers}\n`;
    if (b.notes) m += `Notes: ${b.notes}\n`;
    m += `\nAlso Submit your Aadhar card and Driving Licence.`;
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
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/bookings", form);
      toast.success("Booking received! Redirecting...");
      navigate(`/booking/${data.id}`);
    } catch (e) {
      toast.error("Could not submit booking. Please try WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendWhatsApp = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    try {
      await api.post("/bookings", form);
    } catch (e) {
      // silent — still allow WA send
    }
    window.open(buildWhatsAppLink(buildMessage(form)), "_blank");
  };

  const card =
    variant === "hero"
      ? "bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-5 sm:p-7 border border-white/40"
      : "bg-white shadow-xl rounded-2xl p-5 sm:p-7 border border-orange-100";

  return (
    <div className={card} id={variant === "hero" ? "book" : "book-2"} data-testid={`booking-form-${variant}`}>
      {/* Trip Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Trip Type" icon={<Car size={14} />}>
          <select
            value={form.trip_type}
            onChange={(e) => update("trip_type", e.target.value)}
            className="input-base"
            data-testid="trip-type-select"
          >
            {TRIP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
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
            {ALL_CARS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} (₹{c.per_km}/km)
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Conditional block based on trip type */}
      {tripMeta.isSelfDrive ? (
        <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
          <div className="text-xs uppercase tracking-wider font-semibold text-orange-700 mb-3">
            Choose Pick-up Option
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${
                form.self_drive_option === "drop_at_location"
                  ? "border-orange-500 bg-white"
                  : "border-transparent bg-white/60"
              }`}
              data-testid="opt-drop-at-location"
            >
              <input
                type="radio"
                checked={form.self_drive_option === "drop_at_location"}
                onChange={() => update("self_drive_option", "drop_at_location")}
                className="mt-1"
              />
              <div>
                <div className="font-semibold text-sm">Drop car at my location</div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  Extra charges apply based on location distance.
                </div>
              </div>
            </label>
            <label
              className={`flex gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${
                form.self_drive_option === "pickup_from_us"
                  ? "border-orange-500 bg-white"
                  : "border-transparent bg-white/60"
              }`}
              data-testid="opt-pickup-from-us"
            >
              <input
                type="radio"
                checked={form.self_drive_option === "pickup_from_us"}
                onChange={() => update("self_drive_option", "pickup_from_us")}
                className="mt-1"
              />
              <div>
                <div className="font-semibold text-sm">Pick from our location</div>
                <div className="text-[11px] text-neutral-600 mt-0.5">{OFFICE}</div>
              </div>
            </label>
          </div>

          {form.self_drive_option === "drop_at_location" ? (
            <div className="mt-3">
              <Field label="Your Address" icon={<MapPin size={14} />}>
                <input
                  className="input-base"
                  placeholder="Enter the address where car should be delivered"
                  value={form.pickup_location}
                  onChange={(e) => update("pickup_location", e.target.value)}
                  data-testid="self-drive-address"
                />
              </Field>
            </div>
          ) : (
            <div className="mt-3 rounded-lg overflow-hidden border border-orange-200 h-44">
              <iframe
                title="Pickup location map"
                src={MAP_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pickup Location" icon={<MapPin size={14} />}>
            <input
              className="input-base"
              placeholder="e.g. Pune Airport"
              value={form.pickup_location}
              onChange={(e) => update("pickup_location", e.target.value)}
              data-testid="pickup-location"
            />
          </Field>
          <Field label="Drop Location" icon={<MapPin size={14} />}>
            <input
              className="input-base"
              placeholder="e.g. Lonavala"
              value={form.drop_location}
              onChange={(e) => update("drop_location", e.target.value)}
              data-testid="drop-location"
            />
          </Field>
        </div>
      )}

      {/* Dates / Times */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Pickup Date" icon={<Calendar size={14} />}>
          <input
            type="date"
            className="input-base"
            value={form.pickup_date}
            onChange={(e) => update("pickup_date", e.target.value)}
            data-testid="pickup-date"
          />
        </Field>
        <Field label="Pickup Time" icon={<Clock size={14} />}>
          <input
            type="time"
            className="input-base"
            value={form.pickup_time}
            onChange={(e) => update("pickup_time", e.target.value)}
            data-testid="pickup-time"
          />
        </Field>
        <Field label="Drop Time" icon={<Clock size={14} />}>
          <input
            type="time"
            className="input-base"
            value={form.drop_time}
            onChange={(e) => update("drop_time", e.target.value)}
            data-testid="drop-time"
          />
        </Field>
      </div>

      {/* Personal */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name" icon={<User size={14} />}>
          <input
            className="input-base"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            data-testid="name-input"
          />
        </Field>
        <Field label="Phone Number" icon={<Phone size={14} />}>
          <input
            className="input-base"
            placeholder="+91 99132 58261"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            data-testid="phone-input"
          />
        </Field>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email (optional)" icon={<Mail size={14} />}>
          <input
            className="input-base"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            data-testid="email-input"
          />
        </Field>
        <Field label="Passengers" icon={<Users size={14} />}>
          <input
            type="number"
            min={1}
            max={20}
            className="input-base"
            value={form.passengers}
            onChange={(e) => update("passengers", parseInt(e.target.value || "1"))}
            data-testid="passengers-input"
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Notes (optional)">
          <textarea
            rows={2}
            className="input-base resize-none"
            placeholder="Any special requests, additional stops, luggage etc."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            data-testid="notes-input"
          />
        </Field>
      </div>

      {/* Buttons */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/30 transition"
          data-testid="submit-booking-btn"
        >
          <Send size={16} /> {submitting ? "Submitting..." : "Submit Booking"}
        </button>
        <button
          onClick={sendWhatsApp}
          className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition"
          data-testid="whatsapp-booking-btn"
        >
          <MessageCircle size={16} /> Send on WhatsApp
        </button>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          padding: 0.7rem 0.85rem;
          border: 1px solid #e5e1da;
          border-radius: 0.6rem;
          font-size: 0.875rem;
          background: white;
          outline: none;
          transition: all 0.15s;
        }
        .input-base:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }
      `}</style>
    </div>
  );
}

const Field = ({ label, icon, children }) => (
  <div>
    <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-neutral-600 mb-1.5">
      {icon}
      {label}
    </label>
    {children}
  </div>
);
