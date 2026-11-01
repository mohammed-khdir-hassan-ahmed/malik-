"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";

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

/**
 * گۆڕین و بچووککردنەوەی زیرەکانەی وێنە لە دیوی کڕیاردا پێش ناردن
 * ئەمە ڕێگری دەکات لە هەڵەی 413 و قەبارەی زۆری وێنەی مۆبایلەکان
 */
async function optimizeImageForUpload(file: File): Promise<File> {
  // ئەگەر SVG یان GIF یان کەمتر لە 1.5MB بێت پێویست بە دەستکاری ناکات
  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif" ||
    file.size <= 1.5 * 1024 * 1024
  ) {
    return file;
  }

  return new Promise<File>((resolve) => {
    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = 2400;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            const optimized = new File([blob], cleanName, { type: "image/jpeg" });
            resolve(optimized);
          },
          "image/jpeg",
          0.88
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    } catch {
      resolve(file);
    }
  });
}

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
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setError(null);
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0] ?? null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }

  function handleClearFile() {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError("تکایە سەرەتا وێنەیەک دیاری بکە.");
      return;
    }

    startTransition(async () => {
      try {
        const fileToUpload = await optimizeImageForUpload(selectedFile);
        const formData = new FormData();
        formData.append("section", section);
        formData.append("image", fileToUpload);

        const res = await uploadImage({ ok: false }, formData);
        if (res.ok) {
          handleClearFile();
          setOpen(false);
          router.refresh();
        } else {
          setError(res.error || "بارکردنی وێنەکە سەرکەوتوو نەبوو.");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (
          msg.includes("unexpected response") ||
          msg.includes("Failed to fetch") ||
          msg.includes("NetworkError")
        ) {
          setError(
            "هەڵەیەک لە پەیوەندی لەگەڵ سێرڤەر دروست بوو. تکایە دووبارە هەوڵبدەوە یان قەبارەی وێنەکە بپشکنە."
          );
        } else {
          setError(msg || "هەڵەیەک ڕوویدا لە کاتی بارکردنی وێنەکە.");
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5 font-kurdish">
            <ImagePlus className="size-4" />
            زیادکردنی وێنە
          </Button>
        }
      />
      <DialogContent dir="rtl" className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-kurdish-display font-bold text-lg">
            زیادکردنی وێنە بۆ بەشی {label}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            وێنەیەک هەڵبژێرە لە مۆبایل یان کۆمپیوتەرەکەت بۆ بەشی {label}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
          <input type="hidden" name="section" value={section} />

          <div className="grid gap-2">
            <Label htmlFor={`image-${section}`} className="text-xs sm:text-sm font-medium">
              دیاریکردنی وێنە
            </Label>
            <Input
              ref={fileInputRef}
              id={`image-${section}`}
              name="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={pending}
              className="cursor-pointer file:cursor-pointer file:font-kurdish"
            />
            <p className="text-[11px] text-muted-foreground">
              پشتیوانی لە هەموو جۆرە وێنەیەک دەکرێت (JPG، PNG، WEBP، HEIC، و هتد).
            </p>
          </div>

          {previewUrl && (
            <div className="relative mt-1 overflow-hidden rounded-xl border border-border bg-muted/40 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="پێشبینینی وێنە"
                className="max-h-48 w-full rounded-lg object-contain bg-black/5"
              />
              <button
                type="button"
                onClick={handleClearFile}
                disabled={pending}
                className="absolute top-2 end-2 flex size-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                title="سڕینەوەی هەڵبژاردن"
              >
                <X className="size-4" />
              </button>
              <div className="mt-1 px-2 py-0.5 text-center text-[11px] text-muted-foreground truncate" dir="ltr">
                {selectedFile?.name} ({(selectedFile ? selectedFile.size / (1024 * 1024) : 0).toFixed(2)} MB)
              </div>
            </div>
          )}

          {error ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs sm:text-sm leading-relaxed text-destructive">
              {error}
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose
              render={
                <Button variant="outline" type="button" disabled={pending} className="font-kurdish">
                  پاشگەزبوونەوە
                </Button>
              }
            />
            <Button type="submit" disabled={pending || !selectedFile} className="gap-1.5 font-kurdish">
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  خەریکی بارکردنە...
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" />
                  بارکردنی وێنە
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
