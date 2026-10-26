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
    <main className="flex min-h-svh flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <LoginForm />
        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          گەڕانەوە بۆ ماڵپەڕ
        </Link>
      </div>
    </main>
  );
}
