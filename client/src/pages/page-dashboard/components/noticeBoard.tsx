import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNoticeBoard } from "@/hooks/use-notice-board";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ImageIcon, Megaphone } from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";
import EditPostDialog from "./EditPostDialog";
import DeletePostDialog from "./DeletePostDialog";
import type { NoticePost } from "@/types/NoticePost";

export default function NoticeBoard() {
  const { user } = useContext(AuthContext);
  const noticeBoardState = useNoticeBoard();
  const { posts, loading } = noticeBoardState;

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

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
          <Megaphone className="size-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Notice Board</h2>
        </div>
        {isAdmin && (
          <CreatePostDialog noticeBoardState={noticeBoardState}>
            <Button size="sm">
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
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground ">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: NoticePost) => (
          <Card key={post.id} className="overflow-hidden">
            {post.image && (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {!post.image && (
              <div className="flex items-center justify-center aspect-video w-full bg-muted/50">
                <ImageIcon className="size-10 text-muted-foreground/30" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base line-clamp-1">
                {post.title}
              </CardTitle>
              <CardDescription>
                {post.authorName} &middot; {formatDate(post.createdAt)}
              </CardDescription>
              {isAdmin && (
                <CardAction>
                  <div className="flex gap-1">
                    <EditPostDialog
                      post={post}
                      noticeBoardState={noticeBoardState}
                    >
                      <Button variant="ghost" size="icon-sm">
                        <Pencil className="size-3.5" />
                      </Button>
                    </EditPostDialog>
                    <DeletePostDialog
                      post={post}
                      noticeBoardState={noticeBoardState}
                    >
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </DeletePostDialog>
                  </div>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                {post.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
