"use client";

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

// Define the type to match your hook
export type MicroSite = {
  id: string | number;
  name: string;
  type?: "consumer" | "business";
  link: string;
  banner?: string;
  logo?: string;
  aboutDesc?: string;
  footerDesc?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export const columns: ColumnDef<MicroSite>[] = [
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
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logo = row.getValue("logo") as string | undefined;
      return logo ? (
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-8 rounded-lg object-cover"
        />
      ) : (
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-500">
          N/A{" "}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
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
              ? "bg-green-200 text-green-800"
              : "bg-orange-200 text-orange-800"
          }`}
        >
          {type || "—"}
        </div>
      );
    },

    enableSorting: true,
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link") as string;
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline inline-flex items-center gap-1"
        >
          {link}
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
      const timeAgo = formatDistanceToNow(date, { addSuffix: true }); // "2 hours ago"
      return <div className="text-sm text-muted-foreground">{timeAgo}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const microsite = row.original;
      return (
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
              onClick={() => navigator.clipboard.writeText(microsite.link)}
            >
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(microsite.link, "_blank")}
            >
              View microsite
            </DropdownMenuItem>
            <DropdownMenuItem>Edit microsite</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              Delete microsite
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
