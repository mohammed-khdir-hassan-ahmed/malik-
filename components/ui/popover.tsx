"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "cn"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return (
    <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
  )
}

function PopoverContent({
  className,
  align = "end",
  sideOffset = 8,
  ...props
}: PopoverPrimitive.Popup.Props & {
  align?: PopoverPrimitive.Positioner.Props["align"]
  sideOffset?: PopoverPrimitive.Positioner.Props["sideOffset"]
}) {
  return (
    <PopoverPrimitive.Portal data-slot="popover-portal">
      <PopoverPrimitive.Positioner
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50",
          // لە مۆبایل: مۆدال لە ناوەڕاستی شاشە + پاشبنەمای تاریک
          "max-sm:fixed! max-sm:inset-0! max-sm:left-0! max-sm:top-0! max-sm:right-0! max-sm:bottom-0! max-sm:transform-none! max-sm:w-auto! max-sm:max-w-none! max-sm:h-auto! max-sm:min-w-0! max-sm:grid max-sm:place-items-center max-sm:bg-black/25! max-sm:p-4"
        )}
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "w-72 rounded-xl bg-popover p-3 text-popover-foreground ring-1 ring-foreground/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            // مۆبایل: کاتی داخستن بە تەواوی شاشە نەبێت — پانی بەقەبارەی شاشە بە لێوار
            "max-sm:relative! max-sm:left-auto! max-sm:top-auto! max-sm:transform-none!",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverClose({ ...props }: PopoverPrimitive.Close.Props) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverClose }
