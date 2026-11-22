"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LuArrowRight } from "react-icons/lu";

// Photos are free to use from Pexels. "fallback" is our own illustration, shown if a photo fails to load.
const slides = [
  {
    image: "https://images.pexels.com/photos/134469/pexels-photo-134469.jpeg?auto=compress&cs=tinysrgb&w=1920",
    fallback: "/studios/photo-a.svg",
    eyebrow: "Photo studios",
    title: "Find the perfect room for your next shoot",
    text: "Cyc walls, natural-light lofts and strobe-ready sets, bookable by the hour with prices you can see up front.",
  },
  {
    image: "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=1920",
    fallback: "/studios/film-a.svg",
    eyebrow: "Sound stages",
    title: "Stages big enough for your biggest idea",
    text: "Lighting grids, blackout walls and room for the whole crew. Lock in the hours your production actually needs.",
  },
  {
    image: "https://images.pexels.com/photos/270288/pexels-photo-270288.jpeg?auto=compress&cs=tinysrgb&w=1920",
    fallback: "/studios/podcast-a.svg",
    eyebrow: "Podcast rooms",
    title: "Record in rooms that sound as good as you do",
    text: "Treated lounges with broadcast microphones and comfortable seating, ready for solo shows and full panels.",
  },
  {
    image: "https://images.pexels.com/photos/5650548/pexels-photo-5650548.jpeg?auto=compress&cs=tinysrgb&w=1920",
    fallback: "/studios/music-b.svg",
    eyebrow: "Music suites",
    title: "From the first demo to the final mix",
    text: "Control rooms, live rooms and monitors you can trust. Book a suite by the hour and just make the record.",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured studio types">
      {/* The one main heading of the page. Screen readers and search engines use it. */}
      <h1 className="sr-only">
        StudioSpace: book photo studios, sound stages, podcast rooms and music suites by the hour
      </h1>
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        style={{
          "--swiper-theme-color": "var(--color-primary)",
          "--swiper-navigation-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-[72vh] min-h-[520px] w-full">
              <div
                className="absolute inset-0 bg-neutral bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image}), url(${slide.fallback})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 text-white md:px-10">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                  {slide.eyebrow}
                </p>
                <h2 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                  {slide.title}
                </h2>
                <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
                  {slide.text}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studios" className="btn btn-primary btn-lg">
                    Explore Studios
                    <LuArrowRight size={20} />
                  </Link>
                  <Link
                    href="/add-studio"
                    className="btn btn-lg border-white/60 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-black"
                  >
                    Host Your Space
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
