import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Shared shell for the dashboard cards so they all frame their content the same
// way: icon chip + title + actions in the header, scrollable body underneath.

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  /** Shown as a pill next to the title when there is more than one item. */
  count?: number;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({
  icon: Icon,
  title,
  count,
  actions,
  children,
  className,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        // min-height applies while the cards are stacked; from lg up the grid
        // gives them a fixed height and the body below scrolls instead.
        "flex h-full min-h-[15rem] flex-col overflow-hidden rounded-xl border bg-card shadow-sm lg:min-h-0",
        className,
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          <h2 className="truncate text-sm font-semibold">{title}</h2>
          {count !== undefined && count > 0 && (
            <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </header>

      {/* The single scroll container for the card — content never grows the card. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
        {children}
      </div>
    </section>
  );
}

/** Consistent empty state for every card. */
export function DashboardCardEmpty({
  icon: Icon,
  message,
  hint,
  action,
}: {
  icon: LucideIcon;
  message: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 text-center text-muted-foreground">
      <Icon className="mb-1 size-8 opacity-20" />
      <p className="text-xs font-medium">{message}</p>
      {hint && <p className="text-[11px] opacity-80">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/** Placeholder rows shown while a card is loading for the first time. */
export function DashboardCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
          <Skeleton className="size-9 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
