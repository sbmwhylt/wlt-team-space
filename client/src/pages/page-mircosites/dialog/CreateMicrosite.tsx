import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { ReactNode } from "react";
import CreateMicrositeForm from "../forms/Create";
export default function CreateMicrositeDialog({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Microsite</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new microsite.
          </DialogDescription>
        </DialogHeader>
        <CreateMicrositeForm />
      </DialogContent>
    </Dialog>
  );
}
