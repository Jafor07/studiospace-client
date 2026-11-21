"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuHeart } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import {
  loadWishlist,
  toggleWishlist,
  useWishlist,
} from "@/app/lib/wishlist-store";

// Heart button that saves a studio to the user's wishlist (stored in MongoDB)
export default function WishlistButton({ studioId }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { ids } = useWishlist();

  const userId = session?.user?.id;
  const saved = ids.has(studioId);

  useEffect(() => {
    if (userId) loadWishlist();
  }, [userId]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Please log in to save studios.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const res = await toggleWishlist(studioId);
    if (res.ok) {
      toast.success(
        res.data?.saved
          ? "Saved to your wishlist."
          : "Removed from your saved studios.",
      );
      if (pathname === "/saved") router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved studios" : "Save this studio"}
      aria-pressed={saved}
      className="btn btn-circle btn-sm border-0 bg-base-100/90 shadow hover:bg-base-100"
    >
      <LuHeart size={18} className={saved ? "fill-current text-error" : ""} />
    </button>
  );
}
