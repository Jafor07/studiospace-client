"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuAperture, LuCheck, LuCircle, LuEye, LuEyeOff } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

// The three password rules from the assignment
const passwordRules = [
  {
    id: "length",
    label: "At least 6 characters",
    error: "Password must be at least 6 characters long.",
    test: (value) => value.length >= 6,
  },
  {
    id: "upper",
    label: "One uppercase letter (A-Z)",
    error: "Password must have an uppercase letter.",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lower",
    label: "One lowercase letter (a-z)",
    error: "Password must have a lowercase letter.",
    test: (value) => /[a-z]/.test(value),
  },
];

export default function SignUpPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();

    // 1. Check the password rules before talking to the server
    const brokenRule = passwordRules.find((rule) => !rule.test(password));
    if (brokenRule) {
      setPasswordError(brokenRule.error);
      toast.error(brokenRule.error);
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        return;
      }

      // BetterAuth logs the new user in automatically. The assignment wants
      // the user to land on the Login page, so we log them out again first.
      await authClient.signOut();

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[85vh] items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-content">
              <LuAperture size={26} />
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Join StudioSpace to book creative studios or host your own.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Full name</legend>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                autoComplete="name"
                required
                className="input w-full"
              />
            </fieldset>

            {/* Email */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email address</legend>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="input w-full"
              />
            </fieldset>

            {/* Photo URL */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Photo URL</legend>
              <input
                type="url"
                name="photo"
                placeholder="https://i.ibb.co/your-photo.jpg"
                value={photoUrl}
                onChange={(e) => {
                  setPhotoUrl(e.target.value);
                  setPhotoFailed(false);
                }}
                className="input w-full"
              />
              {photoUrl && !photoFailed && (
                <div className="mt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt="Profile preview"
                    onError={() => setPhotoFailed(true)}
                    className="h-12 w-12 rounded-full border-2 border-primary object-cover"
                  />
                  <span className="text-xs text-base-content/70">
                    Profile photo preview
                  </span>
                </div>
              )}
            </fieldset>

            {/* Password */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                  className="input w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>

              {/* Live checklist */}
              <ul className="mt-2 space-y-1 text-xs">
                {passwordRules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <li
                      key={rule.id}
                      className={`flex items-center gap-2 ${
                        passed ? "text-success" : "text-base-content/60"
                      }`}
                    >
                      {passed ? <LuCheck size={14} /> : <LuCircle size={14} />}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              {passwordError && (
                <p role="alert" className="mt-1 text-sm text-error">
                  {passwordError}
                </p>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="divider my-0 text-xs text-base-content/60">OR</div>

          <GoogleButton callbackURL="/" />

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
