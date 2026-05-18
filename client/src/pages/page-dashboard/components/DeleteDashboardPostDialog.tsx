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
import toast from "react-hot-toast";
import type { useDashboardPosts } from "@/hooks/use-dashboard-posts";
import type { DashboardPost } from "@/types/DashboardPost";

interface Props {
  post: DashboardPost;
  dashboardState: ReturnType<typeof useDashboardPosts>;
  children?: ReactNode;
}

export default function DeleteDashboardPostDialog({ post, dashboardState, children }: Props) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { remove } = dashboardState;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await remove(post.id);
      toast.success("Post deleted successfully");
      setOpen(false);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{post.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
