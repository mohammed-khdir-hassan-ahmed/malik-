"use client";

import * as React from "react";
import { useActionState } from "react";
import {
  Crown,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
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
    <Card className="w-full shadow-sm">
      <CardHeader className="items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-sm">
          <Crown className="size-6" />
        </span>
        <CardTitle className="font-kurdish-display text-xl font-bold">
          چوونەژوورەوە بۆ داشبۆرد
        </CardTitle>
        <CardDescription>
          ئیمەیڵ و وشەی نهێنی بنووسە بۆ بەڕێوبردنی وێنەکان
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">ئیمەیڵ</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                inputMode="email"
                dir="ltr"
                className="ps-9"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">وشەی نهێنی</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                dir="ltr"
                className="px-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? "شاردنەوەی وشەی نهێنی" : "پیشاندانی وشەی نهێنی"
                }
                className="absolute top-1/2 end-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>
          {state.error ? (
            <p className="flex items-start gap-1.5 text-sm leading-relaxed text-destructive">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              {state.error}
            </p>
          ) : null}
          <Button type="submit" size="lg" disabled={pending} className="w-full">
            {pending ? <Loader2 className="animate-spin" /> : <Crown />}
            چوونەژوورەوە
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
