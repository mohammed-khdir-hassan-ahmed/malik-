import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "چوونەژوورەوە — دیکۆراتی مەلیک",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-8 sm:py-16">
      {/* ڕووناکی و شێوازی جوان لە پشتەوەی پەیجەکە */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="size-[420px] sm:size-[560px] rounded-full bg-primary/10 blur-[100px] opacity-70" />
        <div className="absolute top-0 size-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-md">
        <LoginForm />

        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground shadow-sm backdrop-blur transition-all duration-250 hover:border-primary/40 hover:bg-muted hover:text-foreground active:scale-95"
          >
            <ArrowRight className="size-4 transition-transform duration-250 group-hover:-translate-x-1" />
            گەڕانەوە بۆ ماڵپەڕی سەرەکی
          </Link>
        </div>
      </div>
    </main>
  );
}
