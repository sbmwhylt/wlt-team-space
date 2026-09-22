import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useSongPicks } from "@/hooks/use-song-picks";
import type { SongPick } from "@/types/SongPick";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Music, Trash2, Disc3, Play } from "lucide-react";
import AddSongPickDialog from "./AddSongPickDialog";
import DashboardCard, {
  DashboardCardEmpty,
  DashboardCardSkeleton,
} from "./DashboardCard";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// open.spotify.com/track/ID -> open.spotify.com/embed/track/ID
const toEmbedUrl = (url: string | null) => {
  if (!url || !/^https?:\/\/open\.spotify\.com\//.test(url)) return null;
  return url
    .split("?")[0]
    .replace("open.spotify.com/", "open.spotify.com/embed/");
};

export default function SongPickCard() {
  const { user } = useContext(AuthContext);
  const songState = useSongPicks();
  const { songs, loading, remove } = songState;
  const [selected, setSelected] = useState<SongPick | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  // User.id is typed as a string client-side, authorId is an integer column.
  const canRemove = (song: SongPick) =>
    isAdmin || (!!user && String(song.authorId) === String(user.id));

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleRemove = async (e: React.MouseEvent, song: SongPick) => {
    e.stopPropagation();
    try {
      await remove(song.id);
      if (selected?.id === song.id) setSelected(null);
    } catch {
      // hook already logs the failure
    }
  };

  const embedUrl = toEmbedUrl(selected?.url ?? null);

  return (
    <DashboardCard
      icon={Music}
      title="Team Playlist"
      count={songs.length}
      actions={
        <AddSongPickDialog songState={songState}>
          <Button
            size="icon-sm"
            variant="ghost"
            title="Add a song"
            className="text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
          </Button>
        </AddSongPickDialog>
      }
    >
      {loading && songs.length === 0 && <DashboardCardSkeleton rows={3} />}

      {!loading && songs.length === 0 && (
        <DashboardCardEmpty
          icon={Disc3}
          message="No songs yet"
          hint="Add the first pick with +."
        />
      )}

      {/* List — scrolls inside the card rather than being clipped */}
      {songs.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {songs.map((song) => (
            <div
              key={song.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(song)}
              onKeyDown={(e) => e.key === "Enter" && setSelected(song)}
              className="group flex shrink-0 cursor-pointer items-center gap-3 rounded-lg border bg-card p-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {song.thumbnail ? (
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Music className="size-4 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="size-4 fill-white text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-snug">
                  {song.title}
                </p>
                {song.artist && (
                  <p className="truncate text-xs text-muted-foreground">
                    {song.artist}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-1.5">
                  <Avatar className="size-4 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-[8px] font-medium text-primary">
                      {getInitials(song.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {song.authorName} · {formatDate(song.createdAt)}
                  </span>
                </div>
              </div>

              {canRemove(song) && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  onClick={(e) => handleRemove(e, song)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail dialog — plays the track when it came from a Spotify link */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              Added by {selected?.authorName}
              {selected ? ` on ${formatDate(selected.createdAt)}` : ""}
            </DialogDescription>
          </DialogHeader>

          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={selected?.title}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {selected?.artist || "No Spotify link for this one."}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </DashboardCard>
  );
}
