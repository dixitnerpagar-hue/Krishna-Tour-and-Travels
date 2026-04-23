import { useState } from "react";
import { Star, Heart } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function RateUs() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (rating === 0) {
      toast.error("Please choose a star rating");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await api.post("/reviews", {
        review_type: "site",
        target_name: "Krishna Tour & Travels",
        reviewer_name: name,
        rating,
        comment,
      });
      setDone(true);
      toast.success("Dhanyavaad! Your rating has been submitted.");
    } catch (e) {
      toast.error("Could not submit. Please try again.");
    }
  };

  return (
    <section
      id="rate-us"
      className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-5 sm:px-10 py-20 sm:py-24"
      data-testid="rate-us-section"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold mb-5">
          <Heart size={14} className="fill-white" /> Rate Us
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-medium leading-tight">
          Your rating makes us better.
        </h2>
        <p className="mt-4 text-white/85 max-w-lg mx-auto">
          Loved your ride? Share your experience and help other travellers
          discover Krishna Tour &amp; Travels.
        </p>

        {done ? (
          <div className="mt-10 bg-white/15 rounded-2xl p-8 backdrop-blur-md">
            <div className="text-5xl mb-2">🙏</div>
            <div className="font-serif text-2xl">Thank you!</div>
            <p className="mt-2 text-white/85">
              We've recorded your rating of {rating} star{rating > 1 ? "s" : ""}.
            </p>
          </div>
        ) : (
          <div className="mt-10 bg-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-md border border-white/20">
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="star-btn"
                  data-testid={`rate-star-${n}`}
                >
                  <Star
                    size={42}
                    className={
                      n <= (hover || rating)
                        ? "fill-yellow-300 text-yellow-300"
                        : "text-white/40"
                    }
                  />
                </button>
              ))}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 rounded-lg bg-white/95 text-neutral-900 placeholder-neutral-400 mb-3 outline-none"
              data-testid="rate-name"
            />
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience (optional)"
              className="w-full p-3 rounded-lg bg-white/95 text-neutral-900 placeholder-neutral-400 mb-4 outline-none resize-none"
              data-testid="rate-comment"
            />
            <button
              onClick={submit}
              className="bg-neutral-900 hover:bg-black text-white px-8 py-3 rounded-full font-semibold text-sm tracking-wider transition"
              data-testid="rate-submit"
            >
              Submit Rating
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
