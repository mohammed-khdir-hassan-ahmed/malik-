"use client";

import * as React from "react";
import type { Section } from "@/lib/images-types";
import { SECTION_LABELS } from "@/lib/images-types";
import { SECTION_ICONS } from "@/components/section-icons";

interface HeroSectionChipsProps {
  chips: Array<[Section, number]>;
  layout?: "col" | "row";
  className?: string;
}

export function HeroSectionChips({
  chips,
  layout = "col",
  className,
}: HeroSectionChipsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: Section) => {
    e.preventDefault();
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isRow = layout === "row";

  return (
    <div
      className={
        className ??
        (isRow
          ? "flex w-full max-w-md flex-row items-center justify-center gap-2 sm:gap-3"
          : "flex w-full max-w-md flex-col gap-1.5 sm:gap-2.5")
      }
    >
      {chips.map(([section, count], idx) => {
        const Icon = SECTION_ICONS[section];
        const isLead = idx === 0;
        const isFilled = isRow || isLead;

        return (
          <a
            key={section}
            href={`#${section}`}
            onClick={(e) => handleClick(e, section)}
            className={
              isRow
                ? "group flex h-9 flex-1 min-w-0 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:bg-primary/90 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm cursor-pointer"
                : isLead
                  ? "group flex h-7.5 min-w-0 items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md sm:h-9 sm:gap-2 sm:px-4 sm:text-sm cursor-pointer"
                  : "group flex h-7.5 min-w-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[12px] font-medium transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:h-9 sm:gap-2 sm:px-4 sm:text-sm cursor-pointer"
            }
          >
            <Icon
              className={`shrink-0 ${
                isFilled
                  ? "size-3.5 opacity-90 sm:size-4"
                  : "size-3.5 text-primary sm:size-4"
              }`}
            />
            <span className="truncate">{SECTION_LABELS[section]}</span>
            <span
              className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] leading-none sm:text-[11px] ${
                isFilled
                  ? "bg-white/25 text-primary-foreground"
                  : "bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              }`}
            >
              {count}
            </span>
          </a>
        );
      })}
    </div>
  );
}
