"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MicroSite } from "@/types/Microsite";

export interface AuditRow extends MicroSite {
  missing: string[];
  hasStores: boolean;
}

export const auditColumns: ColumnDef<AuditRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Microsite
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium whitespace-nowrap">
        {row.getValue("name")}{" "}
        <Badge className="ml-1 capitalize border-transparent bg-muted text-muted-foreground font-normal">
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    id: "missing",
    accessorFn: (row) => row.missing.length,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Missing
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const missing = row.original.missing;
      return missing.length === 0 ? (
        <Badge className="border-transparent bg-emerald-50 text-emerald-700 font-normal dark:bg-emerald-950 dark:text-emerald-400">
          All present
        </Badge>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {missing.map((label) => (
            <Badge
              key={label}
              className="border-transparent bg-amber-50 text-amber-800 font-normal dark:bg-amber-950 dark:text-amber-400"
            >
              {label}
            </Badge>
          ))}
        </div>
      );
    },
    sortingFn: (a, b) => a.original.missing.length - b.original.missing.length,
  },
  {
    id: "missingCount",
    accessorFn: (row) => row.missing.length,
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # Missing
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium tabular-nums">
        {row.original.missing.length}
      </div>
    ),
  },
  {
    id: "stores",
    accessorFn: (row) => (row.type === "business" ? -1 : row.hasStores ? 1 : 0),
    header: ({ column }) => (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stores
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.type === "business" ? (
          <Badge className="border-transparent bg-muted text-muted-foreground font-normal">
            n/a
          </Badge>
        ) : (
          <Badge
            className={
              row.original.hasStores
                ? "border-transparent bg-emerald-50 text-emerald-700 font-normal dark:bg-emerald-950 dark:text-emerald-400"
                : "border-transparent bg-rose-50 text-rose-700 font-normal dark:bg-rose-950 dark:text-rose-400"
            }
          >
            {row.original.hasStores ? "Yes" : "No"}
          </Badge>
        )}
      </div>
    ),
  },
];
