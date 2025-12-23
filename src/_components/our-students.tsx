"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoplayPlugin from "embla-carousel-autoplay";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@/icons";
import { studentVoices } from "@/constants";

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${
            i < fullStars
              ? "text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "text-yellow-400/50"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function OurStudents() {
  const sectionRef = useScrollAnimation<HTMLElement>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const autoplayRef = useRef(
    AutoplayPlugin({ delay: 5000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: false,
    },
    [autoplayRef.current]
  );

  const handleMouseEnter = useCallback(() => {
    autoplayRef.current.stop();
  }, []);

  const handleMouseLeave = useCallback(() => {
    autoplayRef.current.play();
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelectedIndex = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex((prev) => {
        setPrevIndex(prev);
        return newIndex;
      });
    };

    updateSelectedIndex();
    emblaApi.on("select", updateSelectedIndex);
    return () => {
      emblaApi.off("select", updateSelectedIndex);
    };
  }, [emblaApi]);

  return (
    <section id="students" ref={sectionRef} className="py-20 animate-on-scroll">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-heading uppercase mb-2">
            Our Students
          </h2>
          <hr className="w-16 border-t-4 border-primary mx-auto mb-4" />
          <p className="text-muted">고객의 소리</p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group/carousel"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Embla Carousel */}
          <div className="overflow-hidden select-none py-2 px-1" ref={emblaRef}>
            <div className="flex gap-4">
              {studentVoices.map((student, index) => (
                <div
                  key={index}
                  className="min-w-0 shrink-0 basis-full sm:basis-[calc(50%-8px)] lg:basis-[calc(33.333%-11px)]"
                >
                  <div className="h-[320px] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    {/* Card Header with Profile */}
                    <div className="p-5 pb-3 shrink-0">
                      <div className="flex items-start gap-3">
                        {/* Profile Image */}
                        <div className="relative w-12 h-12 shrink-0">
                          <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-primary/60 p-0.5">
                            <div className="w-full h-full rounded-full overflow-hidden bg-white">
                              <Image
                                src={student.imageUrl}
                                alt={student.name}
                                fill
                                className="object-cover rounded-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Name and Rating */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-heading text-base mb-1 truncate">
                            {student.name}
                          </h4>
                          <RatingStars rating={student.rating} />
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="px-5 flex-1 overflow-hidden">
                      <div className="relative h-full">
                        <span className="absolute -top-1 -left-1 text-3xl text-primary/20 font-serif">
                          &quot;
                        </span>
                        <p className="text-muted text-sm leading-relaxed pl-3 line-clamp-5">
                          {student.review.replace(/\n\n/g, " ")}
                        </p>
                      </div>
                    </div>

                    {/* Shop Items Tags */}
                    <div className="px-5 pb-5 pt-3 shrink-0">
                      <div className="flex flex-wrap gap-1.5">
                        {student.shopItems.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                        {student.shopItems.length > 3 && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-muted text-xs rounded-md">
                            +{student.shopItems.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - hidden on mobile, hover on desktop */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6 text-heading" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6 text-heading" />
          </button>
        </div>

        {/* Progress Bar Indicators */}
        <div className="flex justify-center items-center gap-1 mt-6">
          {studentVoices.map((_, index) => {
            const isSelected = index === selectedIndex;
            const wasPrev = index === prevIndex;

            return (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isSelected
                    ? "w-8 bg-primary"
                    : wasPrev
                    ? "w-4 bg-primary/30"
                    : "w-2 bg-gray-300 hover:bg-primary/50"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
