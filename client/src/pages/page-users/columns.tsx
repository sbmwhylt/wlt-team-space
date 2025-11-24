"use client";

import { useContext, useState } from "react";
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
import { formatDistanceToNow } from "date-fns";
import { useUsers } from "@/hooks/use-users";
import type { User } from "@/types/User";
import { AuthContext } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import UpdateUsersForm from "@/pages/page-users/forms/Update";

export const getColumns = (
  usersState: ReturnType<typeof useUsers>
): ColumnDef<User>[] => [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

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

  // Updated At
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ getValue }) => {
      const date = getValue<Date | undefined>();
      if (!date) return <span>N/A</span>;
      const parsedDate = date instanceof Date ? date : new Date(date);
      if (isNaN(parsedDate.getTime())) return <span>Invalid date</span>;
      return <span>{formatDistanceToNow(parsedDate)} ago</span>;
    },
  },

  // Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { user: currentUser } = useContext(AuthContext);

      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleRemove = async () => {
        setIsLoading(true);
        try {
          await usersState.remove(user.id);
          await usersState.get();
          toast.success("User deleted successfully");
          setDeleteDialogOpen(false);
        } catch (err) {
          toast.error("Failed to delete user");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      const handleEditSuccess = async () => {
        await usersState.get();
        setEditDialogOpen(false);
      };

      return (
        <>
          {currentUser?.role === "super-admin" && (
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
                    onSelect={(e) => {
                      e.preventDefault();
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit User
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  {currentUser?.id !== user.id && (
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        setDeleteDialogOpen(true);
                      }}
                      className="text-red-500"
                    >
                      Delete User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Edit Dialog */}
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      Update the user's information below.
                    </DialogDescription>
                  </DialogHeader>
                  <UpdateUsersForm
                    userId={user.id}
                    update={usersState.update} 
                    onSuccess={() => usersState.get()}
                  />
                </DialogContent>
              </Dialog>

              {/* Delete Dialog */}
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Remove User</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this user?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRemove}
                      disabled={isLoading}
                    >
                      {isLoading ? "Removing..." : "Remove"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </>
      );
    },
  },
];
