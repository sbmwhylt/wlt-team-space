import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { CalendarClock, MapPin, Video, RefreshCw, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatDay = (dateStr: string, isAllDay: boolean) => {
  const date = new Date(dateStr);
  if (isAllDay) {
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

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
  return d > now && d <= weekAhead && !isTomorrow(dateStr);
};

export default function TeamMeetingCard() {
  const { events, loading, refresh } = useCalendar();

  return (
    <div className="border rounded-xl p-4 min-h-[220px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Team Meeting</h2>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={refresh}
          disabled={loading}
          className="text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Loading */}
      {loading && events.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && events.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <CalendarX className="size-8 opacity-20" />
          <p className="text-xs">No upcoming meetings</p>
        </div>
      )}

      {/* Events */}
      {events.length > 0 && (
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {events.map((event: CalendarEvent) => {
            const today = isToday(event.start);
            const tomorrow = isTomorrow(event.start);
            const thisWeek = isThisWeek(event.start);

            return (
              <div
                key={event.id}
                className={`rounded-lg border transition-all duration-150 overflow-hidden ${
                  today
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-card hover:bg-muted/40 hover:border-border"
                }`}
              >
                {/* Accent top bar for today */}
                {today && <div className="h-0.5 w-full bg-primary" />}

                <div className="p-3">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-sm font-semibold line-clamp-1 leading-snug flex-1">
                      {event.title}
                    </p>
                    {today && (
                      <Badge className="rounded-full bg-primary/10 text-primary border-0 text-[10px] font-semibold px-2 shrink-0">
                        <span className="mr-1 size-1.5 rounded-full bg-primary inline-block animate-pulse" />
                        Today
                      </Badge>
                    )}
                    {tomorrow && (
                      <Badge className="rounded-full bg-orange-100 text-orange-600 border-0 text-[10px] font-semibold px-2 shrink-0">
                        Tomorrow
                      </Badge>
                    )}
                    {thisWeek && (
                      <Badge className="rounded-full bg-muted text-muted-foreground border-0 text-[10px] font-semibold px-2 shrink-0">
                        This week
                      </Badge>
                    )}
                  </div>

                  {/* Date + time + duration */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarClock size={10} />
                      <span className="text-[11px] font-medium">
                        {formatDay(event.start, event.isAllDay)}
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
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <MapPin size={10} />
                      <span className="text-[11px] line-clamp-1">{event.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Join Meet button */}
                  {event.meetLink && (
                    <a
                      href={event.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:opacity-90 transition-opacity"
                    >
                      <Video size={10} />
                      Join Meet
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
