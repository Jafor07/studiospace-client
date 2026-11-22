"use client";

import { useCallback, useState } from "react";

// A normal <img> with a safe fallback, because hosts paste image links
// from many different websites (and a photo site can be down or blocked).
export default function StudioImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  // The page is first built on the server. If a photo already failed before
  // React took over, the "onError" event was missed, so we check it once here.
  const checkIfBroken = useCallback((image) => {
    if (
      image &&
      image.complete &&
      image.naturalWidth === 0 &&
      image.getAttribute("src")?.startsWith("http")
    ) {
      setFailed(true);
    }
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={checkIfBroken}
      src={failed || !src ? "/studios/photo-a.svg" : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
