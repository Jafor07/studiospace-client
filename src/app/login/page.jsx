"use client";

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LuAperture, LuCircleAlert, LuEye, LuEyeOff } from "react-icons/lu";
import { authClient } from "@/app/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forgotModalRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // The proxy sends visitors here with ?redirect=/the-page-they-wanted.
  // Only accept paths that start with a single "/" so nobody can use this
  // link to bounce a user to another website.
  const requestedPath = searchParams.get("redirect");
  const redirectTo =
    requestedPath && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        const message = error.message || "Login failed. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back to StudioSpace!");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setFormError("Something went wrong. Please try again.");
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
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-base-content/70">
              Log in to book studios and manage your listings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error message shown inside the form */}
            {formError && (
              <div role="alert" className="alert alert-error alert-soft text-sm">
                <LuCircleAlert size={18} />
                <span>{formError}</span>
              </div>
            )}

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

            {/* Password */}
            <fieldset className="fieldset">
              <div className="flex items-center justify-between">
                <legend className="fieldset-legend">Password</legend>
                <button
                  type="button"
                  onClick={() => forgotModalRef.current?.showModal()}
                  className="link link-primary text-sm"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="divider my-0 text-xs text-base-content/60">OR</div>

          <GoogleButton callbackURL={redirectTo} />

          <p className="text-center text-sm text-base-content/70">
            Don’t have an account?{" "}
            <Link href="/signup" className="link link-primary font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* "Forgot password" pop-up (the assignment says not to build a reset flow) */}
      <dialog ref={forgotModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Password reset isn’t available yet</h3>
          <p className="py-4 text-sm text-base-content/70">
            We are still building email password reset. For now, you can log in
            with Google, or create a new account with a different email address.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary">Got it</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </main>
  );
}

// useSearchParams() needs a Suspense boundary so the page can still be built
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[85vh] items-center justify-center bg-base-200">
          <span className="loading loading-spinner loading-lg text-primary" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
