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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Megaphone,
  Calendar,
} from "lucide-react";
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
          <Megaphone className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-600">Notice Board</h2>
        </div>
        {isAdmin && (
          <CreatePostDialog noticeBoardState={noticeBoardState}>
            <Button size="sm" variant="outline">
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

      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post: NoticePost) => (
          <Card
            key={post.id}
            className="group shadow-none p-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20"
          >
            {post.image ? (
              <div className="relative aspect-video w-full overflow-hidden ">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center aspect-video w-full bg-gradient-to-br from-muted/40 to-muted/80">
                <ImageIcon className="size-12 text-muted-foreground/20" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="items-center justify-between">
                <CardTitle className="text-base font-semibold line-clamp-1">
                  {post.title}
                </CardTitle>
                {isAdmin && (
                  <CardAction>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
              </div>
              <CardDescription className="flex items-center gap-2">
                <Avatar className="size-5">
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
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-normal gap-1"
                >
                  <Calendar className="size-2.5" />
                  {formatDate(post.createdAt)}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
