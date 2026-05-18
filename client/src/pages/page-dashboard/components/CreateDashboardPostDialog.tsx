import { useState, useRef, type ReactNode } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import type { useDashboardPosts } from "@/hooks/use-dashboard-posts";
import type { DashboardSection } from "@/types/DashboardPost";

interface Props {
  section: DashboardSection;
  sectionLabel: string;
  dashboardState: ReturnType<typeof useDashboardPosts>;
  imageUpload?: boolean;
  children?: ReactNode;
}

export default function CreateDashboardPostDialog({
  section,
  sectionLabel,
  dashboardState,
  imageUpload = true,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { create } = dashboardState;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    removeImage();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("section", section);
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      if (imageFile) formData.append("image", imageFile);

      await create(formData);
      toast.success("Post created successfully");
      resetForm();
      setOpen(false);
    } catch {
      toast.error("Failed to create post");
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
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New {sectionLabel} Post</DialogTitle>
          <DialogDescription>
            Add a new post to the {sectionLabel} section.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dp-title">Title</Label>
            <Input
              id="dp-title"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dp-content">Content</Label>
            <Textarea
              id="dp-content"
              placeholder="Write your post..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          {imageUpload && (
            <div className="space-y-2">
              <Label>Image (optional)</Label>
              {imagePreview ? (
                <div className="relative rounded-md overflow-hidden border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center w-full h-32 rounded-md border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors cursor-pointer text-muted-foreground"
                >
                  <ImagePlus className="size-8 mb-2 opacity-50" />
                  <span className="text-xs">Click to upload an image</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
