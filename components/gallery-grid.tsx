"use client";

import * as React from "react";
import { Maximize2, X } from "lucide-react";

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

export function GalleryGrid({ section, items }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const activeItem = selectedIndex !== null ? items[selectedIndex] : null;
  const label = SECTION_LABELS[section];
  const SectionIcon = SECTION_ICONS[section];

  // بەڕێوەبردنی کلیکەکانی کیبۆرد (تیری چەپ و ڕاست بۆ گەڕانی ئارەزوومەندانە)
  React.useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === items.length - 1 ? 0 : prev + 1) : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev === 0 ? items.length - 1 : prev - 1) : null
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, items.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {items.map((item, idx) => (
          <figure
            key={item.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative cursor-pointer overflow-hidden rounded-md border border-border bg-card p-1.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(idx);
              }
            }}
          >
            <div className="relative overflow-hidden rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(item)}
                alt={`وێنەی دیکۆرات لە ${label}`}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* نیشانەی بینین لەکاتی هۆڤەرکردن */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 backdrop-blur-[1.5px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Maximize2 className="size-4" />
                </span>
              </div>
            </div>
            {/* ناوی بەش و ئایکۆنی تایبەتی هەر بەشێک (مەغریبی یان ئەسترۆپۆڵ) */}
            <figcaption className="flex items-center justify-between px-1.5 pb-1 pt-2 text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground/80">{label}</span>
              <SectionIcon className="size-3.5 text-primary transition-transform duration-300 group-hover:scale-115" />
            </figcaption>
          </figure>
        ))}
      </div>

      {/* مۆداڵی گەورەکردنی کارد — وێنەکە لەگەڵ دوگمەی داخستن لە خوارەوە و سەرەوە */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-auto max-w-fit max-h-[95vh] border-0 bg-transparent p-0 shadow-none ring-0 outline-none gap-0 overflow-visible"
        >
          {activeItem && (
            <div className="relative flex flex-col items-center justify-center p-0">
              <DialogTitle className="sr-only">
                {label}
              </DialogTitle>

              {/* کۆنتێنەری وێنەکە */}
              <div className="relative inline-block max-w-[94vw] max-h-[82vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(activeItem)}
                  alt={`وێنەی دیکۆرات لە ${label}`}
                  className="max-h-[80vh] max-w-[92vw] w-auto h-auto rounded-xl object-contain shadow-2xl ring-1 ring-white/20 select-none"
                />

                {/* دوگمەی داخستن لە گۆشەی سەرەوە */}
                <DialogClose
                  render={
                    <button
                      type="button"
                      aria-label="داخستن"
                      title="داخستن"
                      className="absolute top-3 end-3 z-30 flex size-9 sm:size-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md border border-white/25 shadow-xl transition-all hover:bg-black/90 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <X className="size-5" />
                    </button>
                  }
                />
              </div>

              {/* دوگمەی داخستن لە خوارەوەی کاردەکە */}
              <div className="mt-3.5 flex justify-center w-full">
                <DialogClose
                  render={
                    <button
                      type="button"
                      className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-7 text-sm font-semibold shadow-lg transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 cursor-pointer font-kurdish border border-white/20"
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
