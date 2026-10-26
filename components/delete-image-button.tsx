"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { removeImage } from "@/app/actions";

export function DeleteImageButton({ id }: { id: string }) {
  return (
    <form action={removeImage}>
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="secondary"
        size="icon-sm"
        aria-label="سڕینەوەی وێنە"
        title="سڕینەوەی وێنە"
        className="border border-border bg-background/90 shadow-sm transition-colors hover:border-destructive/40 hover:bg-destructive hover:text-white"
      >
        <Trash2 />
      </Button>
    </form>
  );
}
