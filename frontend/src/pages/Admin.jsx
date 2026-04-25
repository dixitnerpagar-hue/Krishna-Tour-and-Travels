import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock, LogOut, Bell, Users, Star, Trash2, Check, Clock,
  Home as HomeIcon, Car, ToggleLeft, ToggleRight, IndianRupee,
} from "lucide-react";
import { api } from "@/lib/api";
import { STANDARD_FLEET, PREMIUM_FLEET } from "@/data/cars";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  if (!token) return <Login onLogin={(t) => { localStorage.setItem("admin_token", t); setToken(t); }} />;
  return <Dashboard onLogout={() => { localStorage.removeItem("admin_token"); setToken(null); }} />;
}

function Login({ onLogin }) {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!u || !p) { toast.error("Enter username & password"); return; }
    setBusy(true);
    try {
      const { data } = await api.post("/admin/login", { username: u, password: p });
      onLogin(data.access_token);
      toast.success("Welcome, Pankaj!");
    } catch (e) {
      toast.error("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-900 via-blue-950 to-amber-900 px-5">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl bg-white grid place-items-center p-1.5 border border-neutral-200">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-serif text-2xl">Admin Login</h1>
            <p className="text-xs text-neutral-500">Krishn Tour and Travels</p>
          </div>
        </div>
        <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username"
          className="w-full p-3 border border-neutral-200 rounded-lg mb-3 outline-none focus:border-amber-500"
          data-testid="admin-username" />
        <input value={p} onChange={(e) => setP(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          type="password" placeholder="Password"
          className="w-full p-3 border border-neutral-200 rounded-lg mb-5 outline-none focus:border-amber-500"
          data-testid="admin-password" />
        <button onClick={submit} disabled={busy}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold"
          data-testid="admin-login-btn">
          {busy ? "Signing in..." : "Sign In"}
        </button>
        <Link to="/" className="mt-4 block text-center text-xs text-neutral-500 hover:text-amber-500">
          ← back to website
        </Link>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [availability, setAvailability] = useState({}); // car_name -> {available, note}
  const [tab, setTab] = useState("bookings");

  const load = async () => {
    try {
      const [s, b, r, a] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/bookings"),
        api.get("/reviews"),
        api.get("/cars/availability"),
      ]);
      setStats(s.data);
      setBookings(b.data);
      setReviews(r.data);
      const map = {};
      a.data.forEach((c) => { map[c.car_name] = c; });
      setAvailability(map);
    } catch (e) {
      toast.error("Session expired");
      onLogout();
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const markStatus = async (id, val) => {
    await api.patch(`/bookings/${id}/status?status_value=${val}`);
    toast.success("Updated"); load();
  };
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    await api.delete(`/bookings/${id}`);
    toast.success("Deleted"); load();
  };
  const toggleCar = async (carName) => {
    const cur = availability[carName];
    const newAvail = cur ? !cur.available : false;
    await api.put(`/cars/availability/${encodeURIComponent(carName)}`, { available: newAvail, note: newAvail ? null : "Currently booked" });
    toast.success(newAvail ? "Marked Available" : "Marked Unavailable");
    load();
  };

  const allCars = [...STANDARD_FLEET, ...PREMIUM_FLEET];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-neutral-200">
            <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold">Admin Dashboard</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">
              Krishn Tour and Travels · Pankaj Gemita
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xs px-3 py-2 rounded-lg border border-neutral-200 hover:border-amber-400 flex items-center gap-1.5">
            <HomeIcon size={14} /> Site
          </Link>
          <button onClick={onLogout} className="text-xs px-3 py-2 rounded-lg bg-neutral-900 text-white flex items-center gap-1.5" data-testid="admin-logout">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="px-5 sm:px-8 py-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-7">
          <Stat icon={<Bell />} label="New" value={stats?.new_bookings ?? "-"} color="bg-amber-500" />
          <Stat icon={<Clock />} label="Today" value={stats?.today_bookings ?? "-"} color="bg-blue-500" />
          <Stat icon={<Users />} label="Total" value={stats?.total_bookings ?? "-"} color="bg-emerald-500" />
          <Stat icon={<IndianRupee />} label="Paid" value={stats?.paid_bookings ?? "-"} color="bg-rose-500" />
          <Stat icon={<Star />} label="Reviews" value={stats?.total_reviews ?? "-"} color="bg-purple-500" />
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {[["bookings", "Bookings"], ["availability", "Car Availability"], ["reviews", "Reviews"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === k ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200"}`}
              data-testid={`tab-${k}`}>
              {l}
            </button>
          ))}
        </div>

        {tab === "bookings" && (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="text-left p-3">When</th>
                    <th className="text-left p-3">Trip / Car</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Pickup → Drop</th>
                    <th className="text-left p-3">Date / Time</th>
                    <th className="text-left p-3">Payment</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan={8} className="text-center p-10 text-neutral-500">No bookings yet</td></tr>
                  )}
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-neutral-100 hover:bg-amber-50/40" data-testid={`booking-row-${b.id}`}>
                      <td className="p-3 text-xs text-neutral-500">{new Date(b.created_at).toLocaleString()}</td>
                      <td className="p-3">
                        <div className="font-semibold">{b.trip_type}</div>
                        <div className="text-xs text-neutral-500">{b.car_name || "—"}</div>
                        {b.needs_negotiation && <div className="text-[10px] text-emerald-600 font-bold mt-0.5">NEGOTIATE</div>}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{b.name}</div>
                        <div className="text-xs text-neutral-500">{b.phone}</div>
                      </td>
                      <td className="p-3 text-xs">
                        {b.pickup_location || "—"}
                        <div className="text-neutral-400">→ {b.drop_location || "—"}</div>
                      </td>
                      <td className="p-3 text-xs">
                        {b.pickup_date || "—"} → {b.drop_date || "—"}
                        <div className="text-neutral-500">{b.pickup_time || "--:--"} → {b.drop_time || "--:--"}</div>
                      </td>
                      <td className="p-3">
                        <PaymentBadge status={b.payment_status} method={b.payment_method} />
                      </td>
                      <td className="p-3"><StatusBadge status={b.status} /></td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-1">
                          {b.status === "new" && (
                            <button onClick={() => markStatus(b.id, "confirmed")} className="p-1.5 rounded bg-emerald-500 text-white" title="Confirm">
                              <Check size={14} />
                            </button>
                          )}
                          <button onClick={() => deleteBooking(b.id)} className="p-1.5 rounded bg-red-500 text-white" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "availability" && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <p className="text-sm text-neutral-600 mb-4">
              Toggle a car off when it's booked or in service — customers will see a "Currently booked" badge on the public site.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allCars.map((car) => {
                const av = availability[car.name];
                const isAvail = av ? av.available : true;
                return (
                  <div key={car.name} className={`p-4 rounded-xl border-2 ${isAvail ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
                    <div className="flex items-center gap-3">
                      <Car size={18} className={isAvail ? "text-emerald-600" : "text-red-600"} />
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{car.name}</div>
                        <div className="text-[11px] text-neutral-500">{isAvail ? "Available" : (av?.note || "Currently booked")}</div>
                      </div>
                      <button
                        onClick={() => toggleCar(car.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${isAvail ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}
                        data-testid={`toggle-${car.name.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {isAvail ? <ToggleRight size={16} className="inline" /> : <ToggleLeft size={16} className="inline" />}
                        <span className="ml-1">{isAvail ? "ON" : "OFF"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.length === 0 && <div className="col-span-full text-center text-neutral-500 py-10">No reviews yet</div>}
            {reviews.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                    r.review_type === "site" ? "bg-purple-100 text-purple-700"
                      : r.review_type === "driver" ? "bg-blue-100 text-blue-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}>{r.review_type}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className={i < r.rating ? "fill-amber-500 text-amber-500" : "text-neutral-300"} />
                    ))}
                  </div>
                </div>
                <div className="mt-3 font-semibold">{r.reviewer_name}</div>
                <div className="text-xs text-neutral-500">{r.target_name || "—"}</div>
                <p className="mt-2 text-sm text-neutral-700">"{r.comment || "—"}"</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const Stat = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${color} text-white grid place-items-center`}>{icon}</div>
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="font-serif text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    new: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${map[status] || "bg-neutral-100 text-neutral-700"}`}>{status}</span>;
};

const PaymentBadge = ({ status, method }) => {
  if (status === "fully_paid") return <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-emerald-100 text-emerald-700">PAID</span>;
  if (status === "advance_paid") return <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-blue-100 text-blue-700">50% ({method || "advance"})</span>;
  return <span className="text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold bg-neutral-100 text-neutral-600">PENDING</span>;
};
