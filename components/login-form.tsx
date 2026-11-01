"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginState } from "@/app/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Card className="w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 shadow-xl backdrop-blur-md">
      {/* هێڵێکی ناسک بە ڕەنگی براند لە سەرووی کاردەکە */}
 

      <CardHeader className="items-center gap-3 px-5 pt-7 pb-4 text-center sm:px-8 sm:pt-8">
   

        <div className="space-y-1.5">
          <CardTitle className="font-kurdish-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            دیکۆراتی مەلیک
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            چوونەژوورەوەی سەرپەرشتیار بۆ بەڕێوەبردنی وێنەکانی پڕۆژە
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-7 sm:px-8 sm:pb-8">
        <form action={formAction} className="grid gap-4 sm:gap-5">
          {/* بەشی ئیمەیڵ */}
          <div className="grid gap-2 text-right">
            <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-foreground/90">
              ئیمەیڵ
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                inputMode="email"
                dir="ltr"
                placeholder="name@example.com"
                className="h-11 sm:h-12 ps-10 rounded-xl border-border/80 bg-background/70 text-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* بەشی وشەی نهێنی */}
          <div className="grid gap-2 text-right">
            <Label htmlFor="password" className="text-xs sm:text-sm font-medium text-foreground/90">
              وشەی نهێنی
            </Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 start-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                dir="ltr"
                placeholder="••••••••"
                className="h-11 sm:h-12 px-10 rounded-xl border-border/80 bg-background/70 text-sm transition-all focus-visible:border-primary focus-visible:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "شاردنەوەی وشەی نهێنی" : "پیشاندانی وشەی نهێنی"
                }
                className="absolute top-1/2 end-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* پەیامی هەڵە لەکاتی هەبوونی هەڵە */}
          {state.error ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs sm:text-sm leading-relaxed text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          ) : null}

          {/* دوگمەی چوونەژوورەوە */}
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-11 sm:h-12 w-full gap-2 rounded-xl bg-primary text-sm sm:text-base font-semibold text-primary-foreground shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg active:scale-[0.99] font-kurdish cursor-pointer"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                خەریکی چوونەژوورەوەیە...
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                چوونەژوورەوە
              </>
            )}
          </Button>

        
        </form>
      </CardContent>
    </Card>
  );
}
