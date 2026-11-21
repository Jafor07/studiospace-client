"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuStar } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import { apiRequest } from "@/app/lib/client-api";
import { formatShortDate, getInitials } from "@/app/lib/utils";

export function Stars({ value, size = 16 }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <LuStar
          key={n}
          size={size}
          className={n <= Math.round(value) ? "fill-current text-primary" : "text-base-300"}
        />
      ))}
    </span>
  );
}

export default function ReviewSection({ studioId, reviews, rating, reviewCount, isOwner }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Please write at least 5 characters.");
      return;
    }
    setLoading(true);
    const res = await apiRequest(`/studios/${studioId}/reviews`, {
      method: "POST",
      body: { rating: score, comment },
    });
    setLoading(false);

    if (!res.ok) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    setComment("");
    router.refresh();
  };

  return (
    <section aria-labelledby="reviews-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-heading" className="text-2xl font-extrabold">
          Reviews
        </h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <Stars value={rating} />
            <span className="text-sm font-semibold">
              {Number(rating).toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-box border border-dashed border-base-300 p-6 text-center text-sm text-base-content/70">
          No reviews yet. Be the first creator to share how your session went.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review, index) => (
            <li key={index} className="rounded-box border border-base-300 bg-base-100 p-5">
              <div className="flex items-center gap-3">
                {review.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={review.image}
                    alt={review.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/15 text-sm font-bold text-secondary">
                    {getInitials(review.name)}
                  </span>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-base-content/60">{formatShortDate(review.createdAt)}</p>
                </div>
                <Stars value={review.rating} size={14} />
              </div>
              <p className="mt-3 text-sm text-base-content/80">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Review form: logged-in guests only */}
      <div className="mt-6 rounded-box bg-base-200 p-5">
        {isOwner ? (
          <p className="text-sm text-base-content/70">
            This is your studio, so reviews can only come from your guests.
          </p>
        ) : !session?.user ? (
          <p className="text-sm text-base-content/70">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="link link-primary font-semibold"
            >
              Log in
            </Link>{" "}
            to leave a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="font-bold">Leave a review</h3>
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((n) => (
                <input
                  key={n}
                  type="radio"
                  name="rating"
                  className="mask mask-star-2 bg-primary"
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  checked={score === n}
                  onChange={() => setScore(n)}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="How was the space, the gear and the host?"
              className="textarea w-full"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="loading loading-spinner loading-sm" />}
              Post Review
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
