import { useState } from "react";
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
import { useMicroSites } from "@/hooks/use-microsites";

export default function CreateMicrositeDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { get } = useMicroSites();

  const handleSuccess = async () => {
    setOpen(false);
    await get();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Microsite</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new microsite.
          </DialogDescription>
        </DialogHeader>
        <CreateMicrositeForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
