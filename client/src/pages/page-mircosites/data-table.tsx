"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { ChevronDown, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateMicrositeDialog from "@/pages/page-mircosites/dialog/CreateMicrositeDialog";
import { Spinner } from "@/components/ui/spinner";
import { SquareArrowOutUpRight } from "lucide-react";
import MicrositeCard from "@/pages/page-mircosites/MicrositeCard";
import { type MicroSite } from "@/types/Microsite";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filtering, setFiltering] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<
    "all" | "business" | "consumer"
  >("all");
  const [, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"table" | "grid">("table");

  const isLoading = data.length === 0;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    onGlobalFilterChange: setFiltering,

    state: {
      globalFilter: filtering,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleTypeFilter = (value: "all" | "business" | "consumer") => {
    setTypeFilter(value);
    table
      .getColumn("type")
      ?.setFilterValue(value === "all" ? undefined : value);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between gap-2">
        {filterColumn && (
          <Input
            placeholder={`Filter ${filterColumn}s...`}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        <div className="flex items-center gap-3 w-lg">
          <Input
            placeholder="Search by name, type, or slug..."
            value={filtering ?? ""}
            onChange={(event) => setFiltering(event.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-1 rounded-md border p-1">
            {(["all", "business", "consumer"] as const).map((val) => (
              <button
                key={val}
                onClick={() => handleTypeFilter(val)}
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
          <div className="flex items-center rounded-md border">
            <button
              onClick={() => setView("table")}
              className={`p-1.5 rounded-l-md transition ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              title="Table view"
            >
              <List size={22} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-r-md transition ${view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
              title="Grid view"
            >
              <LayoutGrid size={22} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => window.open(import.meta.env.VITE_PROD_URL, "_blank")}
            rel="noopener noreferrer"
            variant="outline"
            className="cursor-pointer"
          >
            <SquareArrowOutUpRight />
            Microsites Page
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <CreateMicrositeDialog>
            <Button
              variant="default"
              className="ml-auto"
              onClick={() => setOpen(true)}
            >
              Create
            </Button>
          </CreateMicrositeDialog>
        </div>
      </div>

      {view === "table" ? (
        <>
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
                    <TableCell colSpan={columns.length} className="h-24 ">
                      <Spinner className="mx-auto h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
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
        </>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-4 w-4" />
            </div>
          ) : table.getFilteredRowModel().rows.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 py-4">
              {table.getFilteredRowModel().rows.map((row) => (
                <MicrositeCard
                  key={row.id}
                  microsite={row.original as MicroSite}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No results.
            </div>
          )}
        </>
      )}
    </div>
  );
}
