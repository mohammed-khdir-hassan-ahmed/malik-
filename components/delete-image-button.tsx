"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

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
import { removeImage } from "@/app/actions";

export function DeleteImageButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("id", id);
        await removeImage(formData);
      } finally {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="سڕینەوەی وێنە"
            title="سڕینەوەی وێنە"
            className="border border-border bg-background/90 shadow-sm transition-colors hover:border-destructive/40 hover:bg-destructive hover:text-white"
          >
            <Trash2 />
          </Button>
        }
      />
      <DialogContent dir="rtl" className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <DialogTitle className="text-center font-kurdish-display font-bold">
            سڕینەوەی وێنە
          </DialogTitle>
          <DialogDescription className="text-center">
            دڵنیایت لە سڕینەوەی ئەم وێنەیە؟ ئەم کارە ناگەڕێتەوە.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <DialogClose
            render={
              <Button variant="outline" type="button" disabled={pending}>
                <X className="size-4" />
                نەخێر، پاشگەزبوونەوە
              </Button>
            }
          />
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            بەڵێ، بیسڕەوە
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
