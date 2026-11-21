"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/app/lib/auth-client";

// Shared "Continue with Google" button for the Login and Register pages.
// callbackURL is the page the user lands on after Google says "yes".
export default function GoogleButton({ callbackURL = "/" }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed. Please try again.");
        setLoading(false);
      }
      // On success the browser jumps to Google, so there is nothing else to do.
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="btn w-full border-base-300 bg-base-100"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <FcGoogle size={20} />
      )}
      Continue with Google
    </button>
  );
}
