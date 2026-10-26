"use client";

import type { ElementType } from "react";
import { Crown, MapPin, Navigation, Phone, X } from "lucide-react";

import {
  SnapchatIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MAP_URL,
  SHOP_ADDRESS,
  SHOP_PHONE,
  SNAPCHAT_URL,
  TIKTOK_URL,
  WHATSAPP_URL,
} from "@/lib/links";

interface SocialLink {
  name: string;
  href: string;
  icon: ElementType;
  chipClass: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "WhatsApp",
    href: WHATSAPP_URL,
    icon: WhatsappIcon,
    chipClass: "bg-[#25D366] text-white",
  },
  {
    name: "TikTok",
    href: TIKTOK_URL,
    icon: TiktokIcon,
    chipClass: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
  },
  {
    name: "Snapchat",
    href: SNAPCHAT_URL,
    icon: SnapchatIcon,
    chipClass: "bg-[#FFFC00] text-neutral-900",
  },
];

export function ContactMenu() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            size="sm"
            className="h-9 rounded-md px-4 shadow-sm hover:shadow-md"
          >
            <MapPin className="size-4" />
            ناونیشان
          </Button>
        }
      />
      <PopoverContent
        className="w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden p-0 rounded-md"
        sideOffset={10}
      >
        <div>
          {/* سەرەوە — براند + داخستن */}
          <div className="flex items-center gap-2.5 border-b border-border bg-muted/30 px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Crown className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-kurdish-display text-sm font-bold leading-none">
                دیکۆراتی مەلیک
              </p>
              <p className="mt-1 text-[10px] leading-none text-muted-foreground">
                پەیوەندیمان پێوە بکە
              </p>
            </div>
            <PopoverClose
              render={
                <button
                  type="button"
                  aria-label="داخستن"
                  title="داخستن"
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors duration-200 hover:bg-background hover:text-foreground hover:shadow-sm"
                >
                  <X className="size-4" />
                </button>
              }
            />
          </div>

          {/* کارتی ناونیشان + نەخشە */}
          <div className="mx-3 mt-3 rounded-md border border-border bg-background p-3">
            <div className="flex items-start gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <MapPin className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
                  ناونیشان
                </p>
                <p className="mt-1 text-xs leading-relaxed text-foreground">
                  {SHOP_ADDRESS}
                </p>
              </div>
            </div>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Navigation className="size-3.5" />
              کردنەوە لە نەخشە
            </a>
          </div>

          {/* ژمارەی تەلەفۆن — لە مۆبایل ڕاستەوخۆ کەڵینگ دەکاتەوە */}
          <a
            href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}
            aria-label={`کەڵینگ بۆ ${SHOP_PHONE}`}
            className="group mx-3 mt-2.5 flex items-center gap-2.5 rounded-md border border-border bg-background p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <Phone className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
                ژمارەی تەلەفۆن
              </p>
              <p
                dir="ltr"
                className="text-start text-sm font-medium text-foreground"
              >
                {SHOP_PHONE}
              </p>
            </div>
          </a>

          {/* سۆشیاڵ میدیا — کارتی ٣ ستوونی */}
          <div className="p-3 pb-4">
            <p className="px-1 pb-2 pt-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
              بەدوامان بکەوە
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    title={link.name}
                    className="group flex flex-col items-center gap-1.5 rounded-md border border-border bg-background px-1 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-full ${link.chipClass}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span
                      dir="ltr"
                      className="text-[11px] font-medium text-foreground"
                    >
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
