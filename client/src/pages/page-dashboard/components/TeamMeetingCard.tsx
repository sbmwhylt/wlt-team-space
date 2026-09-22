import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { CalendarClock, MapPin, Video, RefreshCw, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardCard, {
  DashboardCardEmpty,
  DashboardCardSkeleton,
} from "./DashboardCard";

const formatDay = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const formatDuration = (start: string, end: string) => {
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  if (diff < 60) return `${diff}m`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const isTomorrow = (dateStr: string) => {
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  );
};

const isThisWeek = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(now.getDate() + 7);
  return d > now && d <= weekAhead && !isToday(dateStr) && !isTomorrow(dateStr);
};

const MAX_VISIBLE_EVENTS = 5;

export default function TeamMeetingCard() {
  const { events, loading, refresh } = useCalendar();
  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);

  return (
    <DashboardCard
      icon={CalendarClock}
      title="Team Meetings"
      count={events.length}
      actions={
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={refresh}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
        </Button>
      }
    >
      {loading && events.length === 0 && <DashboardCardSkeleton rows={3} />}

      {!loading && events.length === 0 && (
        <DashboardCardEmpty
          icon={CalendarX}
          message="No upcoming meetings"
          hint="Anything scheduled will show up here."
        />
      )}

      {events.length > 0 && (
        <div className="flex flex-col gap-2">
          {visibleEvents.map((event: CalendarEvent) => {
            const today = isToday(event.start);
            const tomorrow = isTomorrow(event.start);
            const thisWeek = isThisWeek(event.start);

            return (
              <div
                key={event.id}
                className={cn(
                  "shrink-0 overflow-hidden rounded-lg border transition-colors",
                  today
                    ? "border-primary/30 bg-primary/5"
                    : "bg-card hover:border-border hover:bg-muted/40",
                )}
              >
                {/* Accent top bar for today */}
                {today && <div className="h-0.5 w-full bg-primary" />}

                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-semibold leading-snug">
                    {event.title}
                  </p>

                  {/* Badges + date + time + duration */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
                    {today && (
                      <Badge className="shrink-0 rounded-full border-0 bg-primary/10 px-2 text-[10px] font-semibold text-primary">
                        <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-primary" />
                        Today
                      </Badge>
                    )}
                    {tomorrow && (
                      <Badge className="shrink-0 rounded-full border-0 bg-orange-100 px-2 text-[10px] font-semibold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
                        Tomorrow
                      </Badge>
                    )}
                    {thisWeek && (
                      <Badge className="shrink-0 rounded-full border-0 bg-muted px-2 text-[10px] font-semibold text-muted-foreground">
                        This week
                      </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      <CalendarClock size={10} />
                      <span className="text-[11px] font-medium">
                        {formatDay(event.start)}
                      </span>
                    </div>
                    {!event.isAllDay && (
                      <>
                        <span className="text-[11px]">·</span>
                        <span className="text-[11px]">
                          {formatTime(event.start)}
                        </span>
                        <span className="text-[11px] text-muted-foreground/60">
                          ({formatDuration(event.start, event.end)})
                        </span>
                      </>
                    )}
                    {event.isAllDay && (
                      <>
                        <span className="text-[11px]">·</span>
                        <span className="text-[11px]">All day</span>
                      </>
                    )}
                  </div>

                  {event.location && (
                    <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                      <MapPin size={10} className="shrink-0" />
                      <span className="line-clamp-1 text-[11px]">
                        {event.location}
                      </span>
                    </div>
                  )}

                  {event.description && (
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {event.description}
                    </p>
                  )}

                  {event.meetLink && (
                    <a
                      href={event.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <Video size={10} />
                      Join Meet
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {events.length > MAX_VISIBLE_EVENTS && (
            <p className="shrink-0 pt-1 text-center text-[11px] text-muted-foreground">
              +{events.length - MAX_VISIBLE_EVENTS} more scheduled
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
