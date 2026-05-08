import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { useNoticeBoard } from "@/hooks/use-notice-board";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, ImageIcon, Megaphone, Calendar, ArrowRight } from "lucide-react";
import CreatePostDialog from "@/pages/page-announcements/forms/CreatePostDialog";
import ViewPostDialog from "@/pages/page-announcements/components/ViewPostDialog";
import type { NoticePost } from "@/types/NoticePost";

export default function NoticeBoard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const noticeBoardState = useNoticeBoard();
  const { posts, loading } = noticeBoardState;
  const [viewPost, setViewPost] = useState<NoticePost | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  const latestPostId = posts.length > 0 ? posts[0].id : null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-3 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Notice Board</h2>
        </div>
        {isAdmin && (
          <CreatePostDialog noticeBoardState={noticeBoardState}>
            <Button size="sm" variant="default">
              <Plus className="size-3.5" />
              New Post
            </Button>
          </CreatePostDialog>
        )}
      </div>

      {loading && posts.length === 0 && (
        <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
          Loading posts...
        </div>
      )}

      {!loading && posts.length === 0 && (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Megaphone className="size-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No announcements yet</p>
            {isAdmin && (
              <p className="text-xs mt-1 text-muted-foreground/70">
                Click "New Post" to add the first announcement.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {posts.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/40 hover:border-primary/20 transition-all duration-150 cursor-pointer"
              onClick={() => setViewPost(post)}
            >
              {/* Left: text content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-md font-semibold line-clamp-1 leading-snug">
                    {post.title}
                  </p>
                  {post.id === latestPostId && (
                    <Badge className="shrink-0 bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      Latest
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
                  {post.content}
                </p>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6 shrink-0">
                      <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                        {post.authorName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs font-medium">{post.authorName}</p>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar size={10} />
                    <span className="text-[11px]">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: image preview or placeholder */}
              <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground/30" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={() => navigate("/announcements")}
        >
          View all announcements
          <ArrowRight className="size-3.5" />
        </Button>
      )}

      <ViewPostDialog
        post={viewPost}
        isLatest={viewPost?.id === latestPostId}
        onClose={() => setViewPost(null)}
      />
    </div>
  );
}
