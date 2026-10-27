"use client";

import * as React from "react";
import { useActionState } from "react";
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
import { uploadImage, type UploadState } from "@/app/actions";
import type { Section } from "@/lib/images-types";

const initialState: UploadState = { ok: false };

export function AddImageDialog({
  section,
  label,
}: {
  section: Section;
  label: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [state, formAction, pending] = useActionState(uploadImage, initialState);

  React.useEffect(() => {
    if (state.ok) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- داخستنی دیالۆگ دوای بارکردنی سەرکەوتوو
      setOpen(false);
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <form action={formAction} className="grid gap-4">
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
          {state.ok === false && state.error ? (
            <p className="text-sm leading-relaxed text-destructive">
              {state.error}
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
