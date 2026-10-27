"use client";

import type { ElementType } from "react";
import { Crown, MapPin, Navigation, Phone, X } from "lucide-react";

import {
  FacebookIcon,
  SnapchatIcon,
  TiktokIcon,
  ViberIcon,
  WhatsappIcon,
} from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FACEBOOK_URL,
  MAP_URL,
  SHOP_ADDRESS,
  SHOP_PHONE,
  SNAPCHAT_URL,
  TIKTOK_URL,
  VIBER_URL,
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
    name: "Viber",
    href: VIBER_URL,
    icon: ViberIcon,
    chipClass: "bg-[#7360F2] text-white",
  },
  {
    name: "Facebook",
    href: FACEBOOK_URL,
    icon: FacebookIcon,
    chipClass: "bg-[#1877F2] text-white",
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
    <Dialog>
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="h-9 rounded-md px-4 shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer font-kurdish font-medium gap-2"
          >
            <MapPin className="size-4" />
            <span>ناونیشان</span>
          </Button>
        }
      />
      <DialogContent
        showCloseButton={false}
        className="w-[min(26rem,calc(100vw-2rem))] max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-primary text-primary-foreground border-white/20 shadow-2xl font-kurdish gap-0"
      >
        <div>
          {/* سەرەوە — وێنەی پێشانگا لەگەڵ دوگمەی داخستن */}
          <div className="relative h-44 w-full sm:h-52 overflow-hidden bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/image/hama.jpg"
              alt="دیکۆراتی مەلیک"
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            />
            {/* گۆڕانی ڕەنگ بەسەر وێنەکەدا بۆ جوانی و ڕوونیی دەقەکان */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-black/35" />

            {/* دوگمەی داخستن لە گۆشەی سەرەوە */}
            <DialogClose
              render={
                <button
                  type="button"
                  aria-label="داخستن"
                  title="داخستن"
                  className="absolute top-3 end-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <X className="size-4" />
                </button>
              }
            />

            {/* نیشان و ناوی براند لەسەر وێنەکە */}
            <div className="absolute bottom-3 start-4 end-4 z-10 flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white shadow-sm backdrop-blur-md border border-white/30">
                <Crown className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <DialogTitle className="font-kurdish-display text-base font-bold text-white leading-tight drop-shadow-sm">
                  دیکۆراتی مەلیک
                </DialogTitle>
                <p className="text-[11px] font-medium text-white/90 leading-tight mt-0.5">
                  پێشوازی لە داواکارییەکانتان دەکەین
                </p>
              </div>
            </div>
          </div>

          {/* بەشەکانی زانیاری و پەیوەندی */}
          <div className="p-4 space-y-3">
            {/* کارتی ناونیشان + نەخشە */}
            

            {/* ژمارەی تەلەفۆن — لە هەمان ئاستی ئاسۆیی */}
            <a
              href={`tel:${SHOP_PHONE.replace(/\s/g, "")}`}
              aria-label={`پەیوەندیکردن بە ${SHOP_PHONE}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm transition-colors hover:bg-white/[0.14]"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white border border-white/20 transition-transform group-hover:scale-105">
                  <Phone className="size-4" />
                </span>
                <span className="text-xs font-semibold text-white/85">
                  ژمارەی پەیوەندی:
                </span>
              </div>
              <span
                dir="ltr"
                className="text-sm font-bold text-white tracking-wider"
              >
                {SHOP_PHONE}
              </span>
            </a>

            {/* سۆشیاڵ میدیا */}
            <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold text-white/75 mb-2.5">
                پەیوەندیمان پێوە بکەن لە ڕێگەی
              </p>
              <div className="grid grid-cols-5 gap-2">
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
                      className="group flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-2 px-1 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:border-white/25"
                    >
                      <span
                        className={`flex size-8 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110 ${link.chipClass}`}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <span
                        dir="ltr"
                        className="text-[10px] font-medium text-white/90 truncate max-w-full"
                      >
                        {link.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* دوگمەی داخستن لە خوارەوە */}
            <div className="pt-1 pb-0.5">
              <DialogClose
                render={
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/15 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-[0.98] cursor-pointer"
                  >
                   
                    داخستن
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
