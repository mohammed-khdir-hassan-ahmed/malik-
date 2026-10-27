"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/app/actions";
import type { Section } from "@/lib/images-types";

export function AddImageDialog({
  section,
  label,
}: {
  section: Section;
  label: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      formRef.current?.reset();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const res = await uploadImage({ ok: false }, formData);
        if (res.ok) {
          setOpen(false);
          formRef.current?.reset();
          router.refresh();
        } else {
          setError(res.error || "بارکردنی وێنەکە سەرکەوتوو نەبوو.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "هەڵەیەک ڕوویدا لە بارکردنی وێنە.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <ImagePlus />
            زیادکردنی وێنە
          </Button>
        }
      />
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-kurdish-display font-bold">
            زیادکردنی وێنە — {label}
          </DialogTitle>
          <DialogDescription>
            وێنەیەک هەڵبژێرە تا بگۆڕدرێت بۆ کۆڵەکەی {label}.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4">
          <input type="hidden" name="section" value={section} />
          <div className="grid gap-2">
            <Label htmlFor={`image-${section}`}>وێنە</Label>
            <Input
              id={`image-${section}`}
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              required
            />
            <p className="text-xs text-muted-foreground">
              JPG، PNG، WEBP، AVIF یان GIF — زۆرترین قەبارە 8MB.
            </p>
          </div>
          {error ? (
            <p className="text-sm leading-relaxed text-destructive">
              {error}
            </p>
          ) : null}
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" type="button" disabled={pending} />}
            >
              پاشگەزبوونەوە
            </DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <ImagePlus />}
              بارکردن
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
