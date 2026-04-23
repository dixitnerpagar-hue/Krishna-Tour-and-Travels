import { useEffect, useState } from "react";
import { Star, Car, User as UserIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { DRIVERS, ALL_CARS } from "@/data/cars";

export default function Reviews() {
  const [tab, setTab] = useState("driver"); // driver | car
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    review_type: "driver",
    target_name: DRIVERS[0].name,
    reviewer_name: "",
    rating: 5,
    comment: "",
  });

  const load = async () => {
    try {
      const { data } = await api.get(`/reviews?review_type=${tab}`);
      setReviews(data);
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    load();
  }, [tab]);

  useEffect(() => {
    setForm((p) => ({
      ...p,
      review_type: tab,
      target_name: tab === "driver" ? DRIVERS[0].name : ALL_CARS[0].name,
    }));
  }, [tab]);

  const submit = async () => {
    if (!form.reviewer_name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await api.post("/reviews", form);
      toast.success("Thanks for your review!");
      setForm((p) => ({ ...p, reviewer_name: "", comment: "", rating: 5 }));
      setShowForm(false);
      load();
    } catch (e) {
      toast.error("Could not submit review");
    }
  };

  return (
    <section
      id="reviews"
      className="px-5 sm:px-10 py-20 sm:py-28 max-w-[1500px] mx-auto"
      data-testid="reviews-section"
    >
      <div className="text-center mb-10">
        <div className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-3">
          Client Love
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight">
          Stories from our{" "}
          <em className="text-orange-500 not-italic">passengers</em>.
        </h2>
      </div>

      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => setTab("driver")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
            tab === "driver"
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-700 border-neutral-200 hover:border-orange-400"
          }`}
          data-testid="tab-driver"
        >
          <UserIcon size={14} /> Driver Reviews
        </button>
        <button
          onClick={() => setTab("car")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition ${
            tab === "car"
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-700 border-neutral-200 hover:border-orange-400"
          }`}
          data-testid="tab-car"
        >
          <Car size={14} /> Car Reviews
        </button>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 transition"
          data-testid="open-review-form"
        >
          <Send size={14} /> Write a Review
        </button>
      </div>

      {showForm && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-orange-200 shadow-md mb-10">
          <h3 className="font-serif text-xl mb-4">
            Review a {tab === "driver" ? "Driver" : "Car"}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
                Select {tab === "driver" ? "Driver" : "Car"}
              </label>
              <select
                className="mt-1 w-full p-2.5 border border-neutral-200 rounded-lg text-sm"
                value={form.target_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, target_name: e.target.value }))
                }
                data-testid="review-target"
              >
                {(tab === "driver" ? DRIVERS : ALL_CARS).map((x) => (
                  <option key={x.name} value={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
                Your Name
              </label>
              <input
                className="mt-1 w-full p-2.5 border border-neutral-200 rounded-lg text-sm"
                value={form.reviewer_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, reviewer_name: e.target.value }))
                }
                placeholder="Full name"
                data-testid="review-name"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Rating
            </label>
            <StarPicker
              value={form.rating}
              onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
            />
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-600">
              Comment
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full p-2.5 border border-neutral-200 rounded-lg text-sm resize-none"
              value={form.comment}
              onChange={(e) =>
                setForm((p) => ({ ...p, comment: e.target.value }))
              }
              placeholder="Share your experience"
              data-testid="review-comment"
            />
          </div>
          <button
            onClick={submit}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
            data-testid="submit-review"
          >
            Submit Review
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.length === 0 && (
          <div className="col-span-full text-center text-neutral-500 py-10">
            Be the first to leave a review!
          </div>
        )}
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-2xl border border-neutral-200"
            data-testid={`review-${r.id}`}
          >
            <div className="flex gap-0.5 text-orange-500 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < r.rating ? "fill-orange-500" : "fill-none"}
                />
              ))}
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              "{r.comment || "Great experience!"}"
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <div className="text-sm font-semibold">{r.reviewer_name}</div>
              <div className="text-xs text-neutral-500">
                {tab === "driver" ? "Driver: " : "Car: "}
                {r.target_name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1 mt-2">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className="star-btn"
        data-testid={`star-${n}`}
      >
        <Star
          size={28}
          className={
            n <= value ? "fill-orange-500 text-orange-500" : "text-neutral-300"
          }
        />
      </button>
    ))}
  </div>
);
