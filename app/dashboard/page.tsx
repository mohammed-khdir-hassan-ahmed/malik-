import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { connection } from "next/server";
import { Crown, Loader2 } from "lucide-react";

import { AddImageDialog } from "@/components/add-image-dialog";
import { DeleteImageButton } from "@/components/delete-image-button";
import { SECTION_ICONS } from "@/components/section-icons";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  listImages,
  SECTION_LABELS,
  type Section,
} from "@/lib/images";
import { isAdmin } from "@/lib/session";
import { SECTIONS } from "@/lib/images";

export const metadata: Metadata = {
  title: "داشبۆرد — دیکۆراتی مەلیک",
  robots: { index: false, follow: false },
};

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-md border border-border">
            <div className="flex h-16 items-center gap-3 border-b border-border bg-muted/25 px-4">
              <div className="size-10 animate-pulse rounded-md bg-muted" />
              <div className="h-5 w-28 animate-pulse rounded-sm bg-muted" />
            </div>
            <div className="grid grid-cols-3 gap-3 p-4">
              {[0, 1, 2].map((j) => (
                <div key={j} className="aspect-square animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  // دۆخی چوونەژوورەوە — تانکا کاتی داواکاری بخوێنرێتەوە
  await connection();
  const admin = await isAdmin();
  if (!admin) redirect("/login");

  const images = await listImages();

  return (
    <div className="flex min-h-svh flex-col">
      {/* هیدەری سادە — تەنها براند */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Crown className="size-4" />
            </span>
            <span className="font-kurdish-display text-base font-bold tracking-tight">
              داشبۆرد
            </span>
          </span>
        </div>
      </header>

      {/* تەنها زیادکردن و سڕینەوە */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-8">
          <div className="grid gap-5 lg:grid-cols-2">
            {SECTIONS.map((section: Section) => {
              const items = images.filter((i) => i.section === section);
              const Icon = SECTION_ICONS[section];
              const label = SECTION_LABELS[section];

              return (
                <Card key={section} className="rounded-md gap-0 overflow-hidden py-4">
                  <CardHeader className="border-b border-border bg-muted/25 px-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-kurdish-display text-lg font-bold leading-normal">
                          {label}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {items.length > 0
                            ? `${items.length} وێنە`
                            : "ئامادە بۆ زیادکردن"}
                        </p>
                      </div>
                    </div>
                    <CardAction className="self-center">
                      <AddImageDialog section={section} label={label} />
                    </CardAction>
                  </CardHeader>
                  <CardContent className="px-4">
                    {items.length === 0 ? (
                      <div className="flex aspect-[16/8] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border text-center text-muted-foreground">
                        <Icon className="size-6 opacity-50" />
                        <p className="text-xs">
                          هێشتا هیچ وێنەیەک لە {label} زیاد نەکراوە
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="group relative overflow-hidden rounded-md border border-border bg-card"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/uploads/${item.filename}`}
                              alt={`وێنە لە ${label}`}
                              loading="lazy"
                              className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                            />
                            <div className="absolute top-2 end-2 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100">
                              <DeleteImageButton id={item.id} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* کۆتایی — پەڕەیەکی لینکی دەرچوون بۆ دەستنیشان پردییری نەبێت */}
      <footer className="border-t border-border py-3">
        <p className="text-center text-[10px] text-muted-foreground/70">
          <a href="/logout" className="transition-colors hover:text-foreground">
            دەرچوون
          </a>
        </p>
      </footer>
    </div>
  );
}
