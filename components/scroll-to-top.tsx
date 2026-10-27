"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // ڕێگری لە گەڕانەوەی ئۆتۆماتیکیی شوێنی پێشووی سکڕۆڵ لەلایەن وێبگەڕەوە لەکاتی ڕیفرێشدا
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // ئەگەر هاچ (#) لە بەستەرەکەدا هەبوو، بیسڕەوە بۆ ئەوەی لەکاتی ڕەنبووندا لە سەرەوە بمێنێتەوە
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    // سکڕۆڵکردن بۆ سەری سەرەوە لەکاتی باربوونی پەڕەدا
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });

    // چاودێریکردنی سکڕۆڵ بۆ پیشاندانی دووگمەکە لەکاتی چوونە خوارەوە
    const handleScroll = () => {
      setIsVisible(window.scrollY > 260);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
  <button
  type="button"
  onClick={scrollToTop}
  aria-label="گەڕانەوە بۆ سەرەوە"
  title="گەڕانەوە بۆ سەرەوە"
  className={`fixed bottom-5 right-5 left-auto z-40 flex size-11 sm:size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30 border border-white/20 transition-all duration-300 hover:scale-110 hover:bg-primary/95 active:scale-95 cursor-pointer backdrop-blur-sm ${
    isVisible
      ? "translate-y-0 opacity-100 pointer-events-auto"
      : "translate-y-5 opacity-0 pointer-events-none"
  }`}
>
  <ChevronUp className="size-5 sm:size-6 transition-transform duration-200 hover:-translate-y-0.5" />
</button>
  );
}
