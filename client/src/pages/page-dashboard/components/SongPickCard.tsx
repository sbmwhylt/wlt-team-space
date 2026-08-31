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
import { Plus, Music, Trash2, Disc3 } from "lucide-react";
import AddSongPickDialog from "./AddSongPickDialog";

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
  return url.split("?")[0].replace("open.spotify.com/", "open.spotify.com/embed/");
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
    <div className="border rounded-xl p-4 flex flex-col h-full min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="size-4 text-primary" />
          <h2 className="text-base font-semibold">Team Playlist</h2>
        </div>
        <AddSongPickDialog songState={songState}>
          <Button size="sm" variant="outline" className="border-none shadow-none">
            <Plus className="size-3.5" />
          </Button>
        </AddSongPickDialog>
      </div>

      {/* Loading */}
      {loading && songs.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && songs.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <Disc3 className="size-8 opacity-20" />
          <p className="text-xs">No songs yet — add the first one</p>
        </div>
      )}

      {/* List — scrolls inside the card rather than being clipped */}
      {songs.length > 0 && (
        <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
          {songs.map((song) => (
            <div
              key={song.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(song)}
              onKeyDown={(e) => e.key === "Enter" && setSelected(song)}
              className="group flex items-center gap-3 p-2 rounded-lg border border-border/50 bg-card cursor-pointer hover:bg-muted/40 hover:border-primary/20 transition-all duration-150"
            >
              {song.thumbnail ? (
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="shrink-0 size-10 rounded-md object-cover bg-muted"
                />
              ) : (
                <div className="shrink-0 size-10 rounded-md bg-muted flex items-center justify-center">
                  <Music className="size-4 text-muted-foreground/50" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate leading-snug">{song.title}</p>
                {song.artist && (
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <Avatar className="size-4 shrink-0">
                    <AvatarFallback className="text-[8px] font-medium bg-primary/10 text-primary">
                      {getInitials(song.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {song.authorName} · {formatDate(song.createdAt)}
                  </span>
                </div>
              </div>

              {canRemove(song) && (
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
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
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md">
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
    </div>
  );
}
