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
import UserForm from "../forms/Create"; // Updated import path
import { useUsers } from "@/hooks/use-users";

export default function CreateUserDialog({
  children,
  usersState,
}: {
  children: ReactNode;
  usersState: ReturnType<typeof useUsers>;
}) {
  const [open, setOpen] = useState(false);
  const { create, get } = usersState;

  const handleSuccess = async () => {
    await get();
    setOpen(false);
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
        <UserForm create={create} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
