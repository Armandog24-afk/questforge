"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;

const sideClasses = {
  right: "right-0 top-0 h-full w-full max-w-sm border-l data-[state=open]:slide-in-from-right",
  left: "left-0 top-0 h-full w-full max-w-sm border-r data-[state=open]:slide-in-from-left",
  bottom: "bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl border-t data-[state=open]:slide-in-from-bottom",
};

export function DrawerContent({
  className,
  children,
  title,
  side = "right",
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  title?: string;
  side?: keyof typeof sideClasses;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col gap-3 border-border bg-surface p-5 shadow-2xl animate-in duration-200 focus:outline-none",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          {title && (
            <DialogPrimitive.Title className="font-display text-base font-semibold">
              {title}
            </DialogPrimitive.Title>
          )}
          <DialogPrimitive.Close
            aria-label="Chiudi"
            className="ml-auto rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto qf-scrollbar-thin">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
