import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { ReactNode } from "react";

export default function SupportDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            How can we help you today?
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Contact us at support@example.com
        </p>
      </DialogContent>
    </Dialog>
  );
}
