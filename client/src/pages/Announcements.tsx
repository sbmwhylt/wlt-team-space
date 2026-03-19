import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNoticeBoard } from "@/hooks/use-notice-board";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Megaphone, ChevronLeft, ChevronRight } from "lucide-react";
import AnnouncementCard from "./page-announcements/components/AnnouncementCard";
import ViewPostDialog from "./page-announcements/components/ViewPostDialog";
import CreatePostDialog from "./page-announcements/forms/CreatePostDialog";
import type { NoticePost } from "@/types/NoticePost";

const POSTS_PER_PAGE = 9;

export default function Announcements() {
  const { user } = useContext(AuthContext);
  const noticeBoardState = useNoticeBoard();
  const { posts, loading } = noticeBoardState;
  const [viewPost, setViewPost] = useState<NoticePost | null>(null);
  const [page, setPage] = useState(1);

  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  const latestPostId = posts.length > 0 ? posts[0].id : null;

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE,
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"></div>
          {isAdmin && (
            <CreatePostDialog noticeBoardState={noticeBoardState}>
              <Button size="sm">
                <Plus />
                New Post
              </Button>
            </CreatePostDialog>
          )}
        </div>

        {/* Loading */}
        {loading && posts.length === 0 && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            Loading announcements...
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Megaphone className="size-12 mb-3 opacity-40" />
              <p className="text-sm">No announcements yet.</p>
              {isAdmin && (
                <p className="text-xs mt-1">
                  Click "New Post" to add the first announcement.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Posts grid */}
        {paginatedPosts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedPosts.map((post) => (
              <AnnouncementCard
                key={post.id}
                post={post}
                isLatest={post.id === latestPostId}
                isAdmin={isAdmin}
                noticeBoardState={noticeBoardState}
                onView={setViewPost}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="min-w-8"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      {/* View post dialog */}
      <ViewPostDialog
        post={viewPost}
        isLatest={viewPost?.id === latestPostId}
        onClose={() => setViewPost(null)}
      />
    </MainLayout>
  );
}
