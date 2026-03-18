import { useContext, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [allPostsOpen, setAllPostsOpen] = useState(false);
  const [viewPost, setViewPost] = useState<NoticePost | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";

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

  const visiblePosts = posts.slice(0, 2);

  const renderPostCard = (post: NoticePost) => (
    <Card
      key={post.id}
      className="group shadow-none p-0 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
      onClick={() => setViewPost(post)}
    >
      {post.image ? (
        <div className="relative aspect-video w-full overflow-hidden">
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
        <div className="relative flex items-center justify-center aspect-video w-full bg-gradient-to-br from-muted/40 to-muted/80">
          <ImageIcon className="size-12 text-muted-foreground/20" />
          {post.id === latestPostId && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
              Latest
            </Badge>
          )}
        </div>
      )}
      <CardHeader className="">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {post.title}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Calendar size={10} />
          <p className="text-[10px]">{formatDate(post.createdAt)}</p>
        </div>
        {isAdmin && (
          <CardAction>
            <div
              className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <EditPostDialog post={post} noticeBoardState={noticeBoardState}>
                <Button variant="ghost" size="icon-sm">
                  <Pencil className="size-3.5" />
                </Button>
              </EditPostDialog>
              <DeletePostDialog post={post} noticeBoardState={noticeBoardState}>
                <Button variant="ghost" size="icon-sm">
                  <Trash2 className="size-3.5 text-destructive" />
                </Button>
              </DeletePostDialog>
            </div>
          </CardAction>
        )}
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
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-600">Notice Board</h2>
        </div>
        <div className="flex items-center gap-2">
          {posts.length > 2 && (
            <Dialog open={allPostsOpen} onOpenChange={setAllPostsOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  View All ({posts.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Megaphone className="size-5 text-primary" />
                    All Announcements
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  {posts.map((post: NoticePost) => renderPostCard(post))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          {isAdmin && (
            <CreatePostDialog noticeBoardState={noticeBoardState}>
              <Button size="sm" variant="default">
                <Plus />
                New Post
              </Button>
            </CreatePostDialog>
          )}
        </div>
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

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        {visiblePosts.map((post: NoticePost) => renderPostCard(post))}
      </div>

      <Dialog
        open={!!viewPost}
        onOpenChange={(open) => !open && setViewPost(null)}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {viewPost && (
            <>
              {viewPost.image ? (
                <div className="w-full">
                  <img
                    src={viewPost.image}
                    alt={viewPost.title}
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
                    {viewPost.id === latestPostId && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white text-[10px] px-1.5 py-0.5">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold">{viewPost.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {viewPost.authorName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{viewPost.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span className="text-xs">
                        {formatDate(viewPost.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {viewPost.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
