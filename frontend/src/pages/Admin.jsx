import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  Bell,
  Users,
  Star,
  Trash2,
  Check,
  Clock,
  Home as HomeIcon,
} from "lucide-react";
import { api } from "@/lib/api";

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
      toast.success("Welcome, admin!");
    } catch (e) {
      toast.error("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-orange-900 px-5">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-500 grid place-items-center text-white">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="font-serif text-2xl">Admin Login</h1>
            <p className="text-xs text-neutral-500">Krishna Tour & Travels</p>
          </div>
        </div>
        <input
          value={u}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
          className="w-full p-3 border border-neutral-200 rounded-lg mb-3 outline-none focus:border-orange-500"
          data-testid="admin-username"
        />
        <input
          value={p}
          onChange={(e) => setP(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-neutral-200 rounded-lg mb-5 outline-none focus:border-orange-500"
          data-testid="admin-password"
        />
        <button
          onClick={submit}
          disabled={busy}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition"
          data-testid="admin-login-btn"
        >
          {busy ? "Signing in..." : "Sign In"}
        </button>
        <Link to="/" className="mt-4 block text-center text-xs text-neutral-500 hover:text-orange-500">
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
  const [tab, setTab] = useState("bookings");

  const load = async () => {
    try {
      const [s, b, r] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/bookings"),
        api.get("/reviews"),
      ]);
      setStats(s.data);
      setBookings(b.data);
      setReviews(r.data);
    } catch (e) {
      toast.error("Session expired");
      onLogout();
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000); // poll every 15s for new bookings
    return () => clearInterval(id);
  }, []);

  const markStatus = async (booking_id, val) => {
    await api.patch(`/bookings/${booking_id}/status?status_value=${val}`);
    toast.success("Updated");
    load();
  };

  const deleteBooking = async (booking_id) => {
    if (!window.confirm("Delete this booking?")) return;
    await api.delete(`/bookings/${booking_id}`);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 px-5 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 grid place-items-center text-white font-serif font-bold">
            K
          </div>
          <div>
            <div className="font-serif text-lg font-bold">Admin Dashboard</div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500">
              Krishna Tour & Travels
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="text-xs px-3 py-2 rounded-lg border border-neutral-200 hover:border-orange-400 flex items-center gap-1.5"
          >
            <HomeIcon size={14} /> Site
          </Link>
          <button
            onClick={onLogout}
            className="text-xs px-3 py-2 rounded-lg bg-neutral-900 text-white flex items-center gap-1.5"
            data-testid="admin-logout"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <main className="px-5 sm:px-8 py-8 max-w-[1500px] mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          <Stat icon={<Bell />} label="New" value={stats?.new_bookings ?? "-"} color="bg-orange-500" />
          <Stat icon={<Clock />} label="Today" value={stats?.today_bookings ?? "-"} color="bg-blue-500" />
          <Stat icon={<Users />} label="Total Bookings" value={stats?.total_bookings ?? "-"} color="bg-emerald-500" />
          <Stat icon={<Star />} label="Reviews" value={stats?.total_reviews ?? "-"} color="bg-purple-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            ["bookings", "Bookings"],
            ["reviews", "Reviews"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                tab === k
                  ? "bg-neutral-900 text-white"
                  : "bg-white border border-neutral-200"
              }`}
              data-testid={`tab-${k}`}
            >
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
                    <th className="text-left p-3">Status</th>
                    <th className="text-right p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-10 text-neutral-500">
                        No bookings yet
                      </td>
                    </tr>
                  )}
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-t border-neutral-100 hover:bg-orange-50/40"
                      data-testid={`booking-row-${b.id}`}
                    >
                      <td className="p-3 text-xs text-neutral-500">
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{b.trip_type}</div>
                        <div className="text-xs text-neutral-500">{b.car_name || "—"}</div>
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
                        {b.pickup_date || "—"}
                        <div className="text-neutral-500">
                          {b.pickup_time || "--:--"} → {b.drop_time || "--:--"}
                        </div>
                      </td>
                      <td className="p-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-1">
                          {b.status === "new" && (
                            <button
                              onClick={() => markStatus(b.id, "confirmed")}
                              className="p-1.5 rounded bg-emerald-500 text-white"
                              title="Mark confirmed"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-1.5 rounded bg-red-500 text-white"
                            title="Delete"
                          >
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

        {tab === "reviews" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-10">
                No reviews yet
              </div>
            )}
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-xl border border-neutral-200"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      r.review_type === "site"
                        ? "bg-purple-100 text-purple-700"
                        : r.review_type === "driver"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {r.review_type}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < r.rating
                            ? "fill-orange-500 text-orange-500"
                            : "text-neutral-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 font-semibold">{r.reviewer_name}</div>
                <div className="text-xs text-neutral-500">
                  {r.target_name || "—"}
                </div>
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
    <div className={`w-12 h-12 rounded-xl ${color} text-white grid place-items-center`}>
      {icon}
    </div>
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="font-serif text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    new: "bg-orange-100 text-orange-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${map[status] || "bg-neutral-100 text-neutral-700"}`}>
      {status}
    </span>
  );
};
