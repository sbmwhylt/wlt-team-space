import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, Calendar } from "lucide-react";
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {post && (
          <>
            {post.image ? (
              <div className="w-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-[50vh] object-contain bg-black/5"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 bg-gradient-to-br from-muted/40 to-muted/80">
                <ImageIcon className="size-16 text-muted-foreground/20" />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {isLatest && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
                      Latest
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {post.authorName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span className="text-xs">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
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
