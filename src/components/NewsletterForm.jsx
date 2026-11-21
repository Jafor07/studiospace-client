"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { LuSend } from "react-icons/lu";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("You’re subscribed! Watch your inbox for new studios.");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="join w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address for the newsletter"
        className="input join-item w-full"
      />
      <button type="submit" className="btn btn-primary join-item" aria-label="Subscribe">
        <LuSend size={18} />
      </button>
    </form>
  );
}
