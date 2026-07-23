"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import MainLayout from "@/layouts/MainLayout";
import { useMicroSites } from "@/hooks/use-microsites";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { MicroSite } from "@/types/Microsite";
import { getAuditColumns, type AuditRow } from "@/pages/page-mircosites/audit-columns";

const LINK_FIELDS: { key: keyof MicroSite; label: string }[] = [
  { key: "communityLink", label: "Community" },
  { key: "businessLink", label: "Business" },
  { key: "digitalCardOrderLink", label: "Digital card" },
  { key: "physicalCardOrderLink", label: "Physical card" },
];
const SOCIAL_FIELDS: { key: string; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "website", label: "Website" },
];

function isEmpty(v: unknown) {
  return v === null || v === undefined || v === "";
}

export default function MicrositeLinkAudit() {
  const navigate = useNavigate();
  const { microsites, loading, get, update } = useMicroSites();

  const [filtering, setFiltering] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "missingCount", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "consumer" | "business">(
    "all",
  );
  const [storesFilter, setStoresFilter] = useState<"all" | "yes" | "no">("all");
  const [missingOnly, setMissingOnly] = useState(false);
  const [reviewingIds, setReviewingIds] = useState<Set<string | number>>(
    new Set(),
  );

  const rows: AuditRow[] = useMemo(() => {
    return microsites.map((m) => {
      const applicableLinks =
        m.type === "business"
          ? LINK_FIELDS.filter((f) => f.key !== "businessLink")
          : LINK_FIELDS;
      const social = m.socialLinks || {};
      const missing = [
        ...applicableLinks.filter((f) => isEmpty(m[f.key])).map((f) => f.label),
        ...SOCIAL_FIELDS.filter((f) => isEmpty((social as any)[f.key])).map(
          (f) => f.label,
        ),
      ];
      const hasStores = Array.isArray(m.stores) && m.stores.length > 0;
      return { ...m, missing, hasStores };
    });
  }, [microsites]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (r.isPromotional) return false;
      if (!r.isActive) return false;
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (storesFilter !== "all" && r.type === "business") return false;
      if (storesFilter === "yes" && !r.hasStores) return false;
      if (storesFilter === "no" && r.hasStores) return false;
      if (missingOnly && r.missing.length === 0) return false;
      return true;
    });
  }, [rows, typeFilter, storesFilter, missingOnly]);

  const columns = useMemo(
    () =>
      getAuditColumns(reviewingIds, async (row, reviewed) => {
        setReviewingIds((prev) => new Set(prev).add(row.id));
        try {
          await update(row.id, { linkAuditReviewed: reviewed });
        } finally {
          setReviewingIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        }
      }),
    [update, reviewingIds],
  );

  const table = useReactTable({
    data: filteredRows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setFiltering,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const hay = `${row.original.name} ${row.original.slug}`.toLowerCase();
      return hay.includes(String(filterValue).toLowerCase());
    },
    initialState: { pagination: { pageSize: 15 } },
    state: {
      sorting,
      columnFilters,
      globalFilter: filtering,
    },
  });

  const isLoading = loading && microsites.length === 0;

  return (
    <MainLayout>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-1 -ml-2 text-muted-foreground"
            onClick={() => navigate("/microsites")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Microsites
          </Button>
          <h1 className="text-xl font-semibold">Microsite Link Audit</h1>
          <p className="text-sm text-muted-foreground">
            Missing community/business/card links, socials, and store
            coverage &mdash; live from the database.
          </p>
        </div>
        <Button variant="outline" onClick={() => get()} disabled={loading}>
          {loading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Refetch
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          placeholder="Search by name or slug..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-1 rounded-md border p-1">
          {(["all", "consumer", "business"] as const).map((val) => (
            <button
              key={val}
              onClick={() => setTypeFilter(val)}
              className={`rounded px-3 py-1 text-sm font-medium capitalize transition ${
                typeFilter === val
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-md border p-1">
          {(
            [
              ["all", "Any stores"],
              ["yes", "Has stores"],
              ["no", "No stores"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStoresFilter(val)}
              className={`rounded px-3 py-1 text-sm font-medium transition ${
                storesFilter === val
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMissingOnly((v) => !v)}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            missingOnly
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Missing something
        </button>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <Spinner className="mx-auto h-4 w-4" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No microsites match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} of {rows.length} microsites
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm"
          >
            {[5, 10, 15, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
