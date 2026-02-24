"use client";

import { useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import UpdateMicrositeForm from "./forms/UpdateMicrositeForm";
import UpdateStoreLocator from "./components/updateStoreLocator";
import toast from "react-hot-toast";
import { type MicroSite } from "@/types/Microsite";

function DeleteDialog({
  microsite,
  onDelete,
  open,
  onOpenChange,
}: {
  microsite: MicroSite;
  onDelete: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Microsite</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>"{microsite.name}"</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpdateDialog({
  microsite,
  open,
  onOpenChange,
}: {
  microsite: MicroSite;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Microsite</DialogTitle>
            <DialogDescription>
              Update the <strong>"{microsite.name}"</strong> microsite details.
            </DialogDescription>
          </DialogHeader>

          {/* Pass the microsite data */}
          <UpdateMicrositeForm
            microsite={microsite}
            onSuccess={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function UpdateStoreDialog({
  microsite,
  open,
  onOpenChange,
}: {
  microsite: MicroSite;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/microsites/${microsite.slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          const micrositeStores = data.microsite?.stores || data.stores || [];
          setStores(Array.isArray(micrositeStores) ? micrositeStores : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch stores:", err);
          toast.error("Failed to load stores");
          setStores([]);
          setLoading(false);
        });
    }
  }, [open, microsite.slug, microsite.type]);

  const handleSuccess = () => {
    onOpenChange(false);
    toast.success("Stores updated successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Store Locations</DialogTitle>
          <DialogDescription>
            Update the <strong>"{microsite.name}"</strong> store locations.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading stores...</span>
          </div>
        ) : (
          <UpdateStoreLocator
            micrositeId={microsite.id as string}
            initialLocations={stores.map((store) => ({
              id: store.id,
              name: store.name,
              latitude: parseFloat(store.latitude),
              longitude: parseFloat(store.longitude),
              address: store.address,
            }))}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Remove the parameter if you don't need actions, OR type it properly
export const getColumns = (micrositesState?: {
  update?: (id: string | number, data: any) => Promise<any>;
  remove?: (id: string | number) => Promise<void>;
}): ColumnDef<MicroSite>[] => [
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
  {
    accessorKey: "banner",
    header: "Banner",
    cell: ({ row }) => {
      const banner = row.getValue("banner") as string | undefined;
      return banner ? (
        <img
          src={banner}
          alt="Microsite Banner"
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500">
          N/A
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Type
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div
          className={`capitalize font-medium py-1 px-2 w-fit text-xs rounded-full ${
            type === "consumer"
              ? "bg-blue-200 text-blue-800"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          {type || "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Microsite Link",
    cell: ({ row }) => {
      const slug = row.getValue("slug") as string;
      const msAppUrl = import.meta.env.VITE_MS_APP_URL;
      return (
        <a
          href={`${msAppUrl}/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline inline-flex items-center gap-1"
        >
          {slug}
          <ExternalLink className="w-3 h-3" />
        </a>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      const timeAgo = formatDistanceToNow(date, { addSuffix: true });
      return <div className="text-sm text-muted-foreground">{timeAgo}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const microsite = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
      const [storeDialogOpen, setStoreDialogOpen] = useState(false);

      const handleDelete = () => {
        if (micrositesState?.remove) {
          micrositesState.remove(microsite.id);
          setDeleteDialogOpen(false);
          toast.success("Microsite deleted successfully!");
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://wlt-microsites.vercel.app/${microsite.slug}`,
                  )
                }
              >
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={`https://wlt-microsites.vercel.app/${microsite.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View microsite
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setUpdateDialogOpen(true)}>
                Edit microsite
              </DropdownMenuItem>
              {microsite.type === "consumer" && (
                <DropdownMenuItem onClick={() => setStoreDialogOpen(true)}>
                  Update Stores
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {micrositesState?.remove && (
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete microsite
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Dialog */}
          {micrositesState?.remove && (
            <DeleteDialog
              microsite={microsite}
              onDelete={handleDelete}
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            />
          )}

          {/* Update Dialog */}
          <UpdateDialog
            microsite={microsite}
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
          />

          {/* Store Update Dialog */}
          <UpdateStoreDialog
            microsite={microsite}
            open={storeDialogOpen}
            onOpenChange={setStoreDialogOpen}
          />
        </>
      );
    },
  },
];
