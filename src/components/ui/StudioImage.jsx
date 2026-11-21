"use client";

import { useState } from "react";

// A normal <img> with a safe fallback, because hosts paste image links
// from many different websites.
export default function StudioImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failed || !src ? "/studios/photo-a.svg" : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
