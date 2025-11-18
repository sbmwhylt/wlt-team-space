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
import CreateUserForm from "../forms/Create";
import { useUsers } from "@/hooks/use-users";

export default function CreateUserDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { get } = useUsers();

  const handleSuccess = async () => {
    setOpen(false);
    await get();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user.
          </DialogDescription>
        </DialogHeader>
        <CreateUserForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
