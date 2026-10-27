import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Crown, Loader2 } from "lucide-react";

import { ContactMenu } from "@/components/contact-menu";
import { GalleryGrid } from "@/components/gallery-grid";
import { HeroAnimatedImage } from "@/components/hero-animated-image";
import { HeroSectionChips } from "@/components/hero-section-chips";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SECTION_ICONS } from "@/components/section-icons";
import {
  listImages,
  SECTION_LABELS,
  type ImageRecord,
  type Section,
} from "@/lib/images";

const BRAND = "دیکۆراتی مەلیك";

function Brand() {
  return (
    <Link href="/" aria-label={BRAND} className="flex items-center">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105">
        <Crown className="size-5" />
      </span>
    </Link>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand />
        <ContactMenu />
      </div>
    </header>
  );
}

function Hero({
  counts,
  images,
}: {
  counts: Record<Section, number>;
  images: ImageRecord[];
}) {
  const chips = (Object.entries(counts) as Array<[Section, number]>).filter(
    ([, count]) => count > 0
  );

  return (
    <section>
      <div className="mx-auto grid max-w-6xl grid-cols-[0.88fr_1.12fr] items-center gap-3 px-3.5 py-5 sm:grid-cols-[1.15fr_0.85fr] sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:gap-14">
        {/* دەق — لە ڕاستەوخۆ (RTL) */}
        <div className="flex flex-col items-start gap-2.5 sm:gap-5">
          <h1 className="font-kurdish-display text-balance text-[1.25rem] font-bold leading-[1.35] tracking-tight sm:text-[2.4rem] sm:leading-[1.35] md:text-[3.2rem] md:leading-[1.4] lg:text-[3.6rem]">
            {BRAND}
          </h1>
          <p className="max-w-md font-kurdish text-[0.72rem] leading-relaxed text-muted-foreground sm:text-[0.95rem] sm:leading-loose">
            شکۆی بۆشاییەکانت بە دیزاینی{" "}
            <span className="font-bold text-primary">مەغریبی</span> و{" "}
            <span className="font-bold text-primary">ئەسترۆپۆڵ</span> بڕازێنەوە.
          </p>
          {chips.length > 0 ? (
            <HeroSectionChips chips={chips} />
          ) : (
            <p className="text-xs font-medium text-muted-foreground">
              بەم زووانە وێنەکان دادەنرێن
            </p>
          )}
        </div>

        {/* وێنەی چوارچێوەدار — ئەنیمەیشنی گۆڕینی وێنەکان هەر دوو چرکە جارێک */}
        <HeroAnimatedImage images={images} />
      </div>
    </section>
  );
}

function GallerySection({
  section,
  items,
  index,
}: {
  section: Section;
  items: ImageRecord[];
  index: number;
}) {
  if (items.length === 0) return null;

  const Icon = SECTION_ICONS[section];
  const label = SECTION_LABELS[section];

  return (
    <section id={section} className="scroll-mt-20">
      {/* هیدەری ئەدیتۆری */}
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-sm bg-primary font-kurdish-display text-xs font-bold text-primary-foreground shadow-sm">
            {String(index).padStart(2, "0")}
          </span>
          <h2 className="font-kurdish-display text-xl font-bold leading-normal md:text-2xl">
            {label}
          </h2>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" />
          {items.length} وێنە
        </p>
      </div>

      <GalleryGrid section={section} items={items} />
    </section>
  );
}

async function HomeContent() {
  // وێنەکان لە سێرڤەرەوە دەخوێنرێنەوە — تانکا کاتی داواکاری
  await connection();
  const images = await listImages();

  const moroccan = images.filter((i) => i.section === "moroccan");
  const astropol = images.filter((i) => i.section === "astropol");

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero
          counts={{ moroccan: moroccan.length, astropol: astropol.length }}
          images={images}
        />
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 md:py-14">
          <GallerySection section="moroccan" items={moroccan} index={1} />
          <GallerySection section="astropol" items={astropol} index={2} />
        </div>
      </main>
      <ScrollToTop />
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p dir="ltr" className="text-xs sm:text-sm">
            Designed and developed by{" "}
            <a
              href="https://www.facebook.com/share/19mkyLUi97/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Sha Soft
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div className="flex flex-col items-start gap-4">
        <div className="h-4 w-28 animate-pulse rounded-sm bg-muted" />
        <div className="h-14 w-80 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-full max-w-md animate-pulse rounded-sm bg-muted" />
        <div className="h-9 w-64 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="aspect-[4/4.6] w-full animate-pulse rounded-md bg-muted" />
      {[0, 1].map((row) => (
        <div key={row} className="lg:col-span-2">
          <div className="mb-5 h-8 w-full animate-pulse rounded-sm bg-muted/60" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square sm:aspect-[4/3] animate-pulse rounded-lg sm:rounded-md bg-muted" />
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-center lg:col-span-2">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
