import { useCalendar, type CalendarEvent } from "@/hooks/use-calendar";
import { CalendarClock, MapPin, Video, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateStr: string, isAllDay: boolean) => {
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
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
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

const isThisWeek = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const weekAhead = new Date(now);
  weekAhead.setDate(now.getDate() + 7);
  return d >= now && d <= weekAhead;
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
          className="text-muted-foreground"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Body */}
      {loading && events.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          No upcoming meetings
        </div>
      )}

      {events.length > 0 && (
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {events.map((event: CalendarEvent) => (
            <div
              key={event.id}
              className="rounded-lg border border-border/50 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all duration-150 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold line-clamp-1 leading-snug flex-1">
                  {event.title}
                </p>
                {isToday(event.start) && (
                  <Badge className="rounded-full bg-red-100 text-red-600 border-0 text-[10px] font-semibold px-2 shrink-0">
                    <span className="mr-1 size-1.5 rounded-full bg-red-600 inline-block animate-pulse" />
                    Today
                  </Badge>
                )}
                {!isToday(event.start) && isThisWeek(event.start) && (
                  <Badge className="rounded-full bg-orange-100 text-orange-600 border-0 text-[10px] font-semibold px-2 shrink-0">
                    This week
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <CalendarClock size={10} />
                <span className="text-[11px]">
                  {formatDate(event.start, event.isAllDay)}
                </span>
              </div>

              {event.location && (
                <div className="flex items-center gap-1 mt-0.5 text-muted-foreground">
                  <MapPin size={10} />
                  <span className="text-[11px] line-clamp-1">{event.location}</span>
                </div>
              )}

              {event.description && (
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              )}

              {event.meetLink && (
                <a
                  href={event.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-[11px] text-primary hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video size={10} />
                  Join Meet
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
