"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getImageUrl,
  type ImageRecord,
  type Section,
  SECTION_LABELS,
} from "@/lib/images-types";
import { SECTION_ICONS } from "@/components/section-icons";

interface GalleryGridProps {
  section: Section;
  items: ImageRecord[];
}

/**
 * دروستکردنی کۆد/ژمارەی ڕاندۆمی دیزاینکراو و بێ دووبارەبوونەوە بۆ هەموو کاردەکان
 */
function useUniqueCodes(items: ImageRecord[]) {
  return React.useMemo(() => {
    const codes = new Map<string, string>();
    const used = new Set<number>();

    items.forEach((item, idx) => {
      let num = ((idx * 269 + 137) % 899) + 101;
      while (used.has(num)) {
        num = num + 1 > 999 ? 101 : num + 1;
      }
      used.add(num);
      codes.set(item.id, `#${num}`);
    });

    return codes;
  }, [items]);
}

export function GalleryGrid({ section, items }: GalleryGridProps) {
  // دۆخی وێنەی کراوە لە مۆداڵدا
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  // دۆخی هەر کاردێک بە جیاواز بۆ گۆڕینی وێنە لەسەر خودی کاردەکە
  const [cardIndices, setCardIndices] = React.useState<Record<number, number>>({});

  // دەستنیشانکردنی touch بۆ سوایپ لەسەر مۆبایل لەناو مۆداڵ
  const [touchStartX, setTouchStartX] = React.useState<number | null>(null);

  const uniqueCodes = useUniqueCodes(items);
  const label = SECTION_LABELS[section];
  const SectionIcon = SECTION_ICONS[section];

  // هێنانەپێش یان بردنەدواوەی وێنە لە مۆداڵ
  const goToNext = React.useCallback(() => {
    if (items.length <= 1) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % items.length : null
    );
  }, [items.length]);

  const goToPrev = React.useCallback(() => {
    if (items.length <= 1) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + items.length) % items.length : null
    );
  }, [items.length]);

  // گۆڕینی وێنە لەسەر خودی کاردەکە کاتێک دەست لە دوگمەی چەپ یان ڕاست دەدرێت
  function handleNextCardImage(cardIdx: number) {
    if (items.length <= 1) return;
    setCardIndices((prev) => {
      const current = prev[cardIdx] ?? cardIdx;
      return {
        ...prev,
        [cardIdx]: (current + 1) % items.length,
      };
    });
  }

  function handlePrevCardImage(cardIdx: number) {
    if (items.length <= 1) return;
    setCardIndices((prev) => {
      const current = prev[cardIdx] ?? cardIdx;
      return {
        ...prev,
        [cardIdx]: (current - 1 + items.length) % items.length,
      };
    });
  }

  // بەڕێوەبردنی کلیکەکانی کیبۆرد (تیری چەپ و ڕاست بۆ گەڕان لە مۆداڵ)
  React.useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToNext, goToPrev]);

  // بەڕێوەبردنی سوایپ لە مۆبایل لەناو مۆداڵ
  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // بەرەو چەپ ڕۆیشت
        goToNext();
      } else {
        // بەرەو ڕاست ڕۆیشت
        goToPrev();
      }
    }
    setTouchStartX(null);
  }

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;
  const activeItemCode = activeItem ? uniqueCodes.get(activeItem.id) ?? "" : "";

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((_, cardIdx) => {
          const currentItemIdx = cardIndices[cardIdx] ?? cardIdx;
          const item = items[currentItemIdx] ?? items[cardIdx];
          const itemCode = uniqueCodes.get(item.id) ?? `#${100 + cardIdx}`;

          function handleCardClick() {
            // کردنەوەی یەکسەری کارد لەسەر مۆبایل و کۆمپیوتەر تەنها بە یەک کلیک
            setSelectedIndex(currentItemIdx);
          }

          return (
            <figure
              key={cardIdx}
              data-gallery-card="true"
              onClick={handleCardClick}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg active:scale-[0.98]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedIndex(currentItemIdx);
                }
              }}
            >
              <div className="relative overflow-hidden rounded-lg">
                {/* ژمارەی دیزاینکراوی زۆر جوان و ناسک بەبێ دووبارە بوونەوە */}
                <div className="absolute top-2 start-2 z-20 flex items-center gap-1 rounded-full border border-white/30 bg-black/60 px-2 sm:px-2.5 py-0.5 shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary/60 group-hover:bg-primary group-hover:text-primary-foreground">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-white group-hover:text-primary-foreground">
                    {itemCode}
                  </span>
                </div>

                {/* وێنەی کاردەکە */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(item)}
                  alt={`وێنەی دیکۆرات لە ${label} - ${itemCode}`}
                  className="aspect-square sm:aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* دوگمەی گۆڕینی وێنەی کاردەکە لە هۆڤەردا (پێشوو) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevCardImage(cardIdx);
                  }}
                  aria-label="وێنەی پێشوو"
                  title="وێنەی پێشوو"
                  className="absolute start-1.5 top-1/2 -translate-y-1/2 z-20 flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/25 shadow-lg transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-90 cursor-pointer opacity-0 pointer-events-none sm:group-hover:opacity-100 sm:pointer-events-auto"
                >
                  <ChevronRight className="size-4 sm:size-4.5" />
                </button>

                {/* دوگمەی گۆڕینی وێنەی کاردەکە لە هۆڤەردا (دواتر) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextCardImage(cardIdx);
                  }}
                  aria-label="وێنەی دواتر"
                  title="وێنەی دواتر"
                  className="absolute end-1.5 top-1/2 -translate-y-1/2 z-20 flex size-7 sm:size-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm border border-white/25 shadow-lg transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-90 cursor-pointer opacity-0 pointer-events-none sm:group-hover:opacity-100 sm:pointer-events-auto"
                >
                  <ChevronLeft className="size-4 sm:size-4.5" />
                </button>

                {/* نیشانەی بینین لەکاتی هۆڤەر */}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px] transition-opacity duration-300 opacity-0 pointer-events-none sm:group-hover:opacity-100"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer">
                    <Maximize2 className="size-4" />
                  </span>
                </div>
              </div>

              {/* ناوی بەش و ئایکۆنی تایبەتی هەر بەشێک */}
              <figcaption className="flex items-center justify-between px-1.5 pb-1 pt-2 text-[11px] sm:text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground/85">{label}</span>
                <SectionIcon className="size-3.5 text-primary transition-transform duration-300 group-hover:scale-115" />
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* مۆداڵی گەورەکردنی کارد بە تەواوی شاشە لەگەڵ دوگمەکانی < و > لە هەردوو لا */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-auto max-w-fit max-h-[96vh] border-0 bg-transparent p-0 shadow-none ring-0 outline-none gap-0 overflow-visible"
        >
          {activeItem && (
            <div
              className="relative flex flex-col items-center justify-center p-0 select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <DialogTitle className="sr-only">
                {label} - {activeItemCode}
              </DialogTitle>

              {/* سەرپەڕەی زانیاری: ژمارەی وێنەکان و دوگمەی داخستن */}
              <div className="mb-2 flex w-full items-center justify-between px-2 text-white">
                <span className="flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium text-white/90 shadow-md backdrop-blur-md">
                  {(selectedIndex ?? 0) + 1} لە {items.length}
                </span>

                <DialogClose
                  render={
                    <button
                      type="button"
                      aria-label="داخستن"
                      title="داخستن"
                      className="flex size-8 sm:size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition hover:bg-black/90 active:scale-95 cursor-pointer"
                    >
                      <X className="size-4.5" />
                    </button>
                  }
                />
              </div>

              {/* کۆنتێنەری وێنەکە لەگەڵ ژمارە هەڕەمەکییەکە لەناو ڕسمەکە و دوگمەکانی لای ڕاست و چەپ */}
              <div className="relative inline-block max-w-[94vw] max-h-[78vh]">
                {/* ژمارەی دیزاینکراوی کاردەکە لەناو خودی ڕسمەکە */}
                <div className="absolute top-2.5 start-2.5 sm:top-3.5 sm:start-3.5 z-30 flex items-center gap-1 rounded-full border border-white/35 bg-black/70 px-2.5 sm:px-3.5 py-0.5 sm:py-1 shadow-lg backdrop-blur-md">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
                    {activeItemCode}
                  </span>
                </div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(activeItem)}
                  alt={`وێنەی دیکۆرات لە ${label} - ${activeItemCode}`}
                  className="block max-h-[76vh] max-w-[92vw] w-auto h-auto rounded-2xl object-contain shadow-2xl ring-1 ring-white/20"
                />

                {/* دوگمەی پێشوو */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  aria-label="وێنەی پێشوو"
                  title="وێنەی پێشوو"
                  className="absolute start-2 sm:-start-14 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronRight className="size-5 sm:size-6" />
                </button>

                {/* دوگمەی دواتر */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="وێنەی دواتر"
                  title="وێنەی دواتر"
                  className="absolute end-2 sm:-end-14 top-1/2 -translate-y-1/2 z-30 flex size-9 sm:size-12 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md border border-white/25 shadow-2xl transition-all hover:bg-primary hover:border-primary hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="size-5 sm:size-6" />
                </button>
              </div>

              {/* دوگمەی داخستن لە خوارەوەی کاردەکە */}
              <div className="mt-3 flex justify-center w-full">
                <DialogClose
                  render={
                    <button
                      type="button"
                      className="flex h-9 sm:h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-6 text-xs sm:text-sm font-semibold shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer font-kurdish border border-white/20"
                    >
                      <X className="size-4" />
                      داخستن
                    </button>
                  }
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
