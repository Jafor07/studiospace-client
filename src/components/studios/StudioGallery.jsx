"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StudioImage from "@/components/ui/StudioImage";

// Gallery carousel on the studio details page
export default function StudioGallery({ images, title }) {
  const many = images.length > 1;

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-box border border-base-300 bg-base-200">
      <Swiper
        className="w-full"
        modules={[Navigation, Pagination]}
        navigation={many}
        pagination={many ? { clickable: true } : false}
        style={{
          "--swiper-theme-color": "var(--color-primary)",
          "--swiper-navigation-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="aspect-[16/10] w-full">
              <StudioImage
                src={image}
                alt={`${title}, photo ${index + 1} of ${images.length}`}
                className="h-full w-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}