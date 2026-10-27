"use client";

import * as React from "react";
import { Crown } from "lucide-react";

import { SECTION_ICONS } from "@/components/section-icons";
import {
  getImageUrl,
  type ImageRecord,
  SECTION_LABELS,
} from "@/lib/images-types";

interface HeroAnimatedImageProps {
  images: ImageRecord[];
}

export function HeroAnimatedImage({ images }: HeroAnimatedImageProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  // گۆڕینی نەرمی وێنەکان بە کاتی گونجاو
  React.useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  if (images.length === 0) {
    return (
      <div className="relative">
        <span
          aria-hidden
          className="animate-offset-frame absolute -bottom-3 -start-3 hidden h-full w-full rounded-md border border-primary sm:block"
        />
        <div className="group relative z-0 block rounded-md border border-border bg-card p-1.5 sm:p-2 shadow-sm">
          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-[5px] bg-muted/50 text-muted-foreground sm:aspect-[4/3] md:aspect-[5/5]">
            <Crown className="size-8 opacity-40" />
            <p className="text-xs">وێنەکە بەم زووانە دادەنرێت</p>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex] ?? images[0];
  const Icon = SECTION_ICONS[currentImage.section] ?? Crown;
  const label = SECTION_LABELS[currentImage.section];

  return (
    <div
      className="group relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* چوارچێوەی جوڵاوی دەرەوە — ڕەنگی سەرەکی براند */}
      <span
        aria-hidden
        className="animate-offset-frame absolute -bottom-3 -start-3 hidden h-full w-full rounded-md border border-primary sm:block"
      />

      <div className="relative z-0 block overflow-hidden rounded-md border border-border bg-card p-1.5 sm:p-2 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[5px] bg-neutral-900 sm:aspect-[4/3] md:aspect-[5/5] lg:aspect-[4/4.6]">
          {/* بەشی وێنەکان: ئەنیمەیشنی سلاید و نەرم بە خێرایی کێرڤی iOS (Cubic Bezier) */}
          {images.map((img, idx) => {
            const isCurrent = idx === currentIndex;
            const isPrev =
              idx === (currentIndex - 1 + images.length) % images.length;
            const isNext = idx === (currentIndex + 1) % images.length;

            if (!isCurrent && !isPrev && !isNext) return null;

            let transformStyle = "translate-x-0";
            let opacityStyle = "opacity-100 z-10";

            if (!isCurrent) {
              transformStyle = isPrev ? "-translate-x-full" : "translate-x-full";
              opacityStyle = "opacity-0 z-0 pointer-events-none";
            }

            return (
              <div
                key={img.id}
                className={`absolute inset-0 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${transformStyle} ${opacityStyle}`}
                style={{ willChange: "transform, opacity" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(img)}
                  alt={`دیکۆراتی مەلیک — ${SECTION_LABELS[img.section]}`}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            );
          })}

          {/* خاڵەکانی نیشاندەر — بچووکتر لە مۆبایل */}
          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-2 sm:bottom-3 z-30 flex justify-center pointer-events-none">
              <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/55 px-1.5 sm:px-2.5 py-0.5 sm:py-1 backdrop-blur-md border border-white/20 shadow-md pointer-events-auto">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    aria-label={`وێنەی ${idx + 1}`}
                    className={`rounded-full transition-all duration-500 cursor-pointer ${
                      idx === currentIndex
                        ? "h-1 w-3.5 sm:h-1.5 sm:w-5 bg-white shadow-sm"
                        : "size-1 sm:h-1.5 sm:w-1.5 bg-white/45 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* کارتی سەر وێنە — تەنها لە شاشەی گەورەدا نیشان بدرێت */}
        <a
          href={`#${currentImage.section}`}
          className="hidden lg:flex absolute bottom-4 start-4 z-30 items-center gap-2.5 rounded-md bg-background/95 py-2 pe-3.5 ps-2 shadow-md ring-1 ring-foreground/5 backdrop-blur-md transition-all duration-300 hover:bg-background"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-sm transition-transform duration-300">
            <Icon className="size-3.5" />
          </span>
          <span className="flex flex-col items-start gap-1">
            <span className="font-kurdish-display text-xs font-bold leading-none">
              {label}
            </span>
            <span className="text-[10px] font-medium leading-none text-muted-foreground">
              وێنەی {currentIndex + 1} لە {images.length}
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
