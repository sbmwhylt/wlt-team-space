import type { ComponentProps, ReactNode } from "react";
import { Upload, X, Plus, Trash2, ImagePlus, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Shared building blocks for the microsite create/update forms.

// ─── Note explaining what the card order links control ───────────────────────
export function CardLinksNote({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-xs leading-relaxed text-blue-900",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
      <p>
        These two links control the{" "}
        <span className="font-semibold">Purchase Cards</span> section on the
        microsite — filling the fields shows the purchase cards, clearing it hides it. The digital
        card link covers both the digital and digital bulk cards, and the
        physical card link does the same for physical and physical bulk.
      </p>
    </div>
  );
}

// ─── Section card ────────────────────────────────────────────────────────────
interface SectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
}

export function Section({
  icon: Icon,
  title,
  description,
  badge,
  children,
}: SectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <header className="flex items-start gap-3 border-b border-gray-100 bg-gray-50/60 px-4 py-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            {badge}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

export function TypeBadge({
  type,
  label,
}: {
  type: "consumer" | "business";
  label?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
        type === "business"
          ? "bg-blue-100 text-blue-600"
          : "bg-orange-100 text-orange-600",
      )}
    >
      {label ?? type}
    </span>
  );
}

// ─── Input with leading icon ─────────────────────────────────────────────────
export function IconInput({
  icon: Icon,
  className,
  ...props
}: { icon: LucideIcon } & ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input className={cn("pl-9", className)} {...props} />
    </div>
  );
}

// ─── Single-image upload field ───────────────────────────────────────────────
interface SingleImageUploadProps {
  id: string;
  label: string;
  /** Newly picked file, not yet saved. */
  value: File | null;
  /** Already saved image, when editing. */
  existingUrl?: string;
  onChange: (file: File | null) => void;
}

export function SingleImageUpload({
  id,
  label,
  value,
  existingUrl,
  onChange,
}: SingleImageUploadProps) {
  return (
    <div className="space-y-2">
      {/* Saved image */}
      {!value && existingUrl && (
        <div className="relative h-32 w-full overflow-hidden rounded-xl border border-gray-200">
          <img
            src={existingUrl}
            alt={`Current ${label}`}
            className="h-full w-full object-cover"
          />
          <span className="absolute top-2 left-2 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            Current
          </span>
        </div>
      )}

      {value ? (
        /* New file preview */
        <div className="group relative h-32 w-full overflow-hidden rounded-xl border-2 border-green-400">
          <img
            src={URL.createObjectURL(value)}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/25" />
          <span className="absolute top-2 left-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            New
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white shadow transition hover:bg-red-600"
            title={`Remove ${label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <span className="pointer-events-none absolute bottom-2 left-2 max-w-[80%] truncate rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
            {value.name}
          </span>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500"
        >
          <Upload className="mb-1.5 h-6 w-6" />
          <span className="text-sm font-medium">
            {existingUrl ? "Replace image" : `Upload ${label}`}
          </span>
          <span className="mt-0.5 text-xs text-gray-400">PNG or JPG</span>
          <Input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          />
        </label>
      )}
    </div>
  );
}

// ─── Multi-image marketing section ───────────────────────────────────────────
interface MarketingImageSectionProps {
  label: string;
  inputId: string;
  /** Newly picked files, not yet saved. */
  images: { file: File; preview: string }[];
  onAddNew: (files: FileList) => void;
  onRemove: (index: number) => void;
  /** Already saved image URLs, when editing. */
  existingImages?: string[];
  onDeleteExisting?: (index: number) => void;
}

export function MarketingImageSection({
  label,
  inputId,
  images,
  onAddNew,
  onRemove,
  existingImages = [],
  onDeleteExisting,
}: MarketingImageSectionProps) {
  const totalCount = existingImages.length + images.length;

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50/40 p-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {totalCount > 0 && (
          <span className="text-xs text-gray-400">
            {totalCount} {totalCount === 1 ? "image" : "images"}
          </span>
        )}
      </div>

      {totalCount > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {/* Saved images */}
          {existingImages.map((url, i) => (
            <div
              key={`existing-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <img
                src={url}
                alt={`${label} ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/35" />
              {onDeleteExisting && (
                <button
                  type="button"
                  onClick={() => onDeleteExisting(i)}
                  className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 shadow transition-all group-hover:opacity-100 hover:bg-red-600"
                  title="Delete image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
              <span className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] text-white">
                Saved
              </span>
            </div>
          ))}

          {/* New (staged) images */}
          {images.map((img, i) => (
            <div
              key={`new-${i}`}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-green-400 bg-white shadow-sm"
            >
              <img
                src={img.preview}
                alt={`new ${label} ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/35" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1.5 right-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 shadow transition-all group-hover:opacity-100 hover:bg-red-600"
                title="Remove"
              >
                <X className="h-3 w-3" />
              </button>
              <span className="pointer-events-none absolute bottom-1 left-1 rounded-full bg-green-500 px-1.5 py-0.5 text-[9px] text-white">
                New
              </span>
            </div>
          ))}

          {/* Add tile */}
          <label
            htmlFor={inputId}
            className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
          >
            <Plus className="mb-0.5 h-5 w-5" />
            <span className="text-[11px] font-medium">Add</span>
          </label>
        </div>
      ) : (
        /* Empty state */
        <label
          htmlFor={inputId}
          className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-8 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-500"
        >
          <ImagePlus className="mb-2 h-7 w-7" />
          <span className="text-sm font-medium">Upload images</span>
          <span className="mt-0.5 text-xs text-gray-400">
            PNG, JPG — multiple allowed
          </span>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAddNew(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
