import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { Crown, Gem, Loader2 } from "lucide-react";

import { ContactMenu } from "@/components/contact-menu";
import { SECTION_ICONS } from "@/components/section-icons";
import {
  getImageUrl,
  listImages,
  SECTION_LABELS,
  type ImageRecord,
  type Section,
} from "@/lib/images";

const BRAND = "دیکۆراتی مەلیك";

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Crown className="size-5" />
      </span>
      <span className="font-kurdish-display text-lg font-bold tracking-tight">
        {BRAND}
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
  featured,
  featuredLabel,
}: {
  counts: Record<Section, number>;
  featured: ImageRecord | null;
  featuredLabel: string;
}) {
  const chips = (Object.entries(counts) as Array<[Section, number]>).filter(
    ([, count]) => count > 0
  );
  const featuredCount = featured ? counts[featured.section] : 0;
  const FeaturedIcon = featured ? SECTION_ICONS[featured.section] : Crown;

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-[1.15fr_0.85fr] items-center gap-3.5 px-4 py-6 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16 lg:gap-14">
        {/* دەق — لە ڕاستەوخۆ (RTL) */}
        <div className="flex flex-col items-start gap-3 sm:gap-5">
          <h1 className="font-kurdish-display text-balance text-[1.55rem] font-bold leading-[1.45] tracking-tight sm:text-[2.4rem] sm:leading-[1.35] md:text-[3.2rem] md:leading-[1.4] lg:text-[3.6rem]">
            {BRAND}
          </h1>
          <p className="max-w-md text-[0.8rem] leading-relaxed text-muted-foreground sm:text-[0.95rem] sm:leading-loose">
            نیشانەی جوانی و بەرزکردنەوەی شوێنەکەت — دیکۆراتیەکی تایبەت بە دوو
            ستایلی جیاواز: <span className="font-medium text-foreground">بەشی مەغریبی</span> و{" "}
            <span className="font-medium text-foreground">بەشی ئەسترۆپۆڵ</span>.
          </p>
          {chips.length > 0 ? (
            <div className="flex w-full max-w-md flex-col gap-2.5">
              {chips.map(([section, count], idx) => {
                const Icon = SECTION_ICONS[section];
                const isLead = idx === 0;
                return (
                  <a
                    key={section}
                    href={`#${section}`}
                    className={
                      isLead
                        ? "group flex h-9 min-w-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md"
                        : "group flex h-9 min-w-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                    }
                  >
                    <Icon
                      className={`shrink-0 ${
                        isLead ? "size-4 opacity-90" : "size-4 text-primary"
                      }`}
                    />
                    <span className="truncate">
                      {SECTION_LABELS[section]}
                    </span>
                    <span
                      className={`shrink-0 rounded-sm px-1.5 py-0.5 text-[11px] leading-none ${
                        isLead
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
          ) : (
            <p className="text-xs font-medium text-muted-foreground">
              بەم زووانە وێنەکان دادەنرێن
            </p>
          )}
        </div>

        {/* وێنەی چوارچێوەدار */}
        <div className="relative">
          {/* چوارچێوەی جوڵاو — تەنها بۆردەری ڕەنگی سەرەکی */}
          <span
            aria-hidden
            className="animate-offset-frame absolute -bottom-3 -start-3 hidden h-full w-full rounded-md border border-primary sm:block"
          />
          <a
            href={featured ? `#${featured.section}` : "#moroccan"}
            className="group relative z-0 block rounded-md border border-border bg-card p-2 shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
          <div className="overflow-hidden rounded-[5px]">
            {featured ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={getImageUrl(featured)}
                alt={`وێنەی هەڵبژاردە لە ${featuredLabel}`}
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] sm:aspect-[4/3] md:aspect-[5/5] lg:aspect-[4/4.6]"
              />
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 bg-muted/50 text-muted-foreground sm:aspect-[4/3] md:aspect-[5/5]">
                <Crown className="size-8 opacity-40" />
                <p className="text-xs">وێنەکە بەم زووانە دادەنرێت</p>
              </div>
            )}
          </div>
          {/* کارتی ژمارە — هەڵفڕیو لەسەر وێنە */}
          {featured ? (
            <div className="pointer-events-none absolute bottom-2 start-2 z-10 flex items-center gap-1.5 rounded-md bg-background/95 py-1.5 pe-2.5 ps-1.5 shadow-md ring-1 ring-foreground/5 backdrop-blur-md sm:bottom-4 sm:start-4 sm:gap-2.5 sm:py-2 sm:pe-3.5 sm:ps-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-sm sm:size-7">
                <FeaturedIcon className="size-3 sm:size-3.5" />
              </span>
              <span className="flex flex-col items-start gap-0.5 sm:gap-1">
                <span className="font-kurdish-display text-[10px] font-bold leading-none sm:text-xs">
                  {featuredLabel}
                </span>
                <span className="text-[9px] font-medium leading-none text-muted-foreground sm:text-[10px]">
                  {featuredCount} وێنە
                </span>
              </span>
            </div>
          ) : null}
          </a>
        </div>
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

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <figure
            key={item.id}
            className="group overflow-hidden rounded-md border border-border bg-card p-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="overflow-hidden rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(item)}
                alt={`وێنەی دیکۆرات لە ${label}`}
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
            </div>
            <figcaption className="flex items-center justify-between px-1.5 pb-1 pt-2 text-[10px] text-muted-foreground">
              <span className="font-medium text-foreground/80">{label}</span>
              <Gem className="size-3 text-primary transition-transform duration-300 group-hover:rotate-45" />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

async function HomeContent() {
  // وێنەکان لە سێرڤەرەوە دەخوێنرێنەوە — تانکا کاتی داواکاری
  await connection();
  const images = await listImages();

  const moroccan = images.filter((i) => i.section === "moroccan");
  const astropol = images.filter((i) => i.section === "astropol");

  const featured = moroccan[0] ?? astropol[0] ?? null;
  const featuredLabel = featured
    ? SECTION_LABELS[featured.section]
    : "بەشی مەغریبی";

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero
          counts={{ moroccan: moroccan.length, astropol: astropol.length }}
          featured={featured}
          featuredLabel={featuredLabel}
        />
        <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6 md:py-14">
          <GallerySection section="moroccan" items={moroccan} index={1} />
          <GallerySection section="astropol" items={astropol} index={2} />
        </div>
      </main>
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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-md bg-muted" />
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
