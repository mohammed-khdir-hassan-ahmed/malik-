"use client";

import * as React from "react";
import type { Section } from "@/lib/images-types";
import { SECTION_LABELS } from "@/lib/images-types";
import { SECTION_ICONS } from "@/components/section-icons";

interface HeroSectionChipsProps {
  chips: Array<[Section, number]>;
}

export function HeroSectionChips({ chips }: HeroSectionChipsProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, section: Section) => {
    e.preventDefault();
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-1.5 sm:gap-2.5">
      {chips.map(([section, count], idx) => {
        const Icon = SECTION_ICONS[section];
        const isLead = idx === 0;
        return (
          <a
            key={section}
            href={`#${section}`}
            onClick={(e) => handleClick(e, section)}
            className={
              isLead
                ? "group flex h-7.5 min-w-0 items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md sm:h-9 sm:gap-2 sm:px-4 sm:text-sm cursor-pointer"
                : "group flex h-7.5 min-w-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[12px] font-medium transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:h-9 sm:gap-2 sm:px-4 sm:text-sm cursor-pointer"
            }
          >
            <Icon
              className={`shrink-0 ${isLead
                  ? "size-3.5 opacity-90 sm:size-4"
                  : "size-3.5 text-primary sm:size-4"
                }`}
            />
            <span className="truncate">{SECTION_LABELS[section]}</span>
            <span
              className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] leading-none sm:text-[11px] ${isLead
                  ? "bg-white/25"
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
