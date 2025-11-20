"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { useUsers } from "@/hooks/use-users";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export type User = {
  id: string | number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  status: "active" | "inactive";
  role: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ID
  // {
  //   accessorKey: "id",
  //   header: "ID",
  //   cell: ({ getValue }) => (
  //     <span className="text-gray-700">{getValue<string>()}</span>
  //   ),
  // },

  // Avatar
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as string | undefined;
      return avatar ? (
        <img
          src={avatar}
          alt="avatar"
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 bg-gray-100">
          N/A
        </div>
      );
    },
    enableSorting: false,
  },

  // Name fields
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const firstName = row.getValue("firstName") as string;
      return <span className="ml-3">{firstName}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const lastName = row.getValue("lastName") as string;
      return <span className="ml-3">{lastName}</span>;
    },
    enableSorting: true,
  },
  { accessorKey: "userName", header: "Username" },
  { accessorKey: "email", header: "Email" },

  // Role
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <span className="capitalize">{getValue<string>()}</span>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  // Status
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs capitalize ${
            status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: true,
  },

  // Created At
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = getValue<Date>();
      return <span>{formatDistanceToNow(new Date(date))} ago</span>;
    },
  },

  // Actions
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const { remove } = useUsers();
      const [open, setOpen] = useState(false);

      const handleEdit = () => {
        window.location.href = `/users/${user.id}`;
      };

      const handleDelete = async () => {
        try {
          toast.success("User deleted successfully");
          await remove(user.id);
          setOpen(false);
        } catch (err) {
          toast.error("Failed to delete user");
          console.error("Failed to delete user:", err);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => (window.location.href = `/users/${user.id}`)}
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpen(true)}
                className="text-red-500"
              >
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --- Delete confirmation dialog --- */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
