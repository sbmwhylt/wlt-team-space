import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import type { useSongPicks } from "@/hooks/use-song-picks";

interface Props {
  songState: ReturnType<typeof useSongPicks>;
  children?: ReactNode;
}

export default function AddSongPickDialog({ songState, children }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { create } = songState;

  const isSpotifyUrl = /^https?:\/\/open\.spotify\.com\//.test(url.trim());

  const resetForm = () => {
    setTitle("");
    setArtist("");
    setUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // The server fills the title in from a Spotify link, so either one will do.
    if (!title.trim() && !isSpotifyUrl) {
      toast.error("Add a song title or a Spotify link");
      return;
    }
    setSubmitting(true);
    try {
      await create({ title: title.trim(), artist: artist.trim(), url: url.trim() });
      toast.success("Song added");
      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to add song");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Song</DialogTitle>
          <DialogDescription>
            Paste a Spotify link and the title and cover art fill in automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sp-url">Spotify link</Label>
            <Input
              id="sp-url"
              placeholder="https://open.spotify.com/track/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sp-title">
              Title {isSpotifyUrl && <span className="text-muted-foreground">(optional)</span>}
            </Label>
            <Input
              id="sp-title"
              placeholder="Song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sp-artist">Artist (optional)</Label>
            <Input
              id="sp-artist"
              placeholder="Artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Song"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
