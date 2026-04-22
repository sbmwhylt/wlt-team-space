import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNoticeBoard } from "@/hooks/use-notice-board";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, ImageIcon, Megaphone, Calendar } from "lucide-react";
import CreatePostDialog from "@/pages/page-announcements/forms/CreatePostDialog";
import ViewPostDialog from "@/pages/page-announcements/components/ViewPostDialog";
import type { NoticePost } from "@/types/NoticePost";

export default function NoticeBoard() {
  const { user } = useContext(AuthContext);
  const noticeBoardState = useNoticeBoard();
  const { posts, loading } = noticeBoardState;
  const [viewPost, setViewPost] = useState<NoticePost | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

  const recentPosts = posts.slice(0, 2);
  const latestPostId = posts.length > 0 ? posts[0].id : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          <h2 className="text-lg font-medium text-gray-600 dark:text-gray-200">Notice Board</h2>
        </div>
        {isAdmin && (
          <CreatePostDialog noticeBoardState={noticeBoardState}>
            <Button size="sm" variant="default">
              <Plus />
              New Post
            </Button>
          </CreatePostDialog>
        )}
      </div>

      {loading && posts.length === 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          Loading posts...
        </div>
      )}

      {!loading && posts.length === 0 && (
        <Card className="border-none shadow-none h-full">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Megaphone className="size-10 mb-3 opacity-40" />
            <p className="text-sm">No announcements yet.</p>
            {isAdmin && (
              <p className="text-xs mt-1">
                Click "New Post" to add the first announcement.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {recentPosts.length > 0 && (
        <div className="grid gap-2 grid-cols-2">
          {recentPosts.map((post) => (
            <Card
              key={post.id}
              className="group shadow-none p-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
              onClick={() => setViewPost(post)}
            >
              {post.image ? (
                <div className="relative h-[210px] w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {post.id === latestPostId && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
                      Latest
                    </Badge>
                  )}
                </div>
              ) : (
                <div className="relative flex items-center justify-center h-[120px] w-full bg-gradient-to-br from-muted/40 to-muted/80">
                  <ImageIcon className="size-8 text-muted-foreground/20" />
                  {post.id === latestPostId && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
                      Latest
                    </Badge>
                  )}
                </div>
              )}

              <CardHeader className="gap-0">
                <div className="flex justify-between items-start">
                  <div className="group">
                    <CardTitle className="text-md font-semibold line-clamp-1">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <p className="text-[10px]">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-[16px] bg-primary/10 text-primary">
                        {post.authorName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pb-4 ">
                <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-2 leading-relaxed">
                  {post.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ViewPostDialog
        post={viewPost}
        isLatest={viewPost?.id === latestPostId}
        onClose={() => setViewPost(null)}
      />
    </div>
  );
}
