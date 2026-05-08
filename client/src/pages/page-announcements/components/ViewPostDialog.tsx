import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import type { NoticePost } from "@/types/NoticePost";

interface Props {
  post: NoticePost | null;
  isLatest: boolean;
  onClose: () => void;
}

export default function ViewPostDialog({ post, isLatest, onClose }: Props) {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {post && (
          <>
            {post.image && (
              <div className="relative w-full overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={post.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-50"
                />
                <img
                  src={post.image}
                  alt={post.title}
                  className="relative z-10 w-full max-h-[420px] object-contain"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                {isLatest && (
                  <Badge className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shadow-sm">
                    Latest
                  </Badge>
                )}
              </div>
            )}

            <div className="p-6 space-y-5">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold leading-tight">{post.title}</h2>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                        {post.authorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span className="text-xs">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              <hr className="border-border/60" />

              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {post.content}
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
