"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Path } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMicroSites } from "@/hooks/use-microsites";
import { toast } from "react-hot-toast";
import { Upload, X, ImagePlus, Plus, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import type { MicroSite } from "@/types/Microsite";
export type { MicroSite } from "@/types/Microsite";

const micrositeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["consumer", "business"]),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  banner: z.any().optional(),
  aboutDesc: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    x: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
  digitalCardOrderLink: z.string().url().optional().or(z.literal("")),
  physicalCardOrderLink: z.string().url().optional().or(z.literal("")),
  communityLink: z.string().url().optional().or(z.literal("")),
  businessLink: z.string().url().optional().or(z.literal("")),
  marketingImgs_brandAssets: z.array(z.any()).optional(),
  marketingImgs_campaignsAndPromos: z.array(z.any()).optional(),
  marketingImgs_socialContent: z.array(z.any()).optional(),
  marketingImgs_participationContent: z.array(z.any()).optional(),
  marketingVids: z.array(z.any()).optional(),
  physicalImg: z.any().optional(),
  digitalImg: z.any().optional(),
  physicalBulkImg: z.any().optional(),
  digitalBulkImg: z.any().optional(),
  color: z.enum(Object.keys(colors) as [string, ...string[]]),
  isPromotional: z.boolean(),
  isActive: z.boolean(),
});

type MicrositeFormValues = z.infer<typeof micrositeSchema>;

interface UpdateMicrositeFormProps {
  microsite: MicroSite;
  onSuccess?: () => void;
}

// ─── Reusable single-image upload field ──────────────────────────────────────
interface SingleImageUploadProps {
  id: string;
  existingUrl?: string;
  newFile: File | null;
  label: string;
  onChange: (file: File | null) => void;
}

function SingleImageUpload({
  id,
  existingUrl,
  newFile,
  label,
  onChange,
}: SingleImageUploadProps) {
  return (
    <div className="space-y-2">
      {/* Existing image */}
      {!newFile && existingUrl && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={existingUrl}
            alt={`Current ${label}`}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Current
          </span>
        </div>
      )}

      {/* New file preview */}
      {newFile ? (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-green-400">
          <img
            src={URL.createObjectURL(newFile)}
            alt="New preview"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            New
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-gray-400 hover:text-blue-500"
        >
          <Upload className="w-6 h-6 mb-1.5" />
          <span className="text-sm font-medium">
            {existingUrl ? "Replace image" : `Upload ${label}`}
          </span>
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

// ─── Reusable multi-image marketing section ───────────────────────────────────
interface MarketingImageSectionProps {
  label: string;
  inputId: string;
  existingImages: string[];
  newImages: { file: File; preview: string }[];
  onDeleteExisting: (index: number) => void;
  onAddNew: (files: FileList) => void;
  onRemoveNew: (index: number) => void;
}

function MarketingImageSection({
  label,
  inputId,
  existingImages,
  newImages,
  onDeleteExisting,
  onAddNew,
  onRemoveNew,
}: MarketingImageSectionProps) {
  const totalCount = existingImages.length + newImages.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-4 space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{label}</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            Business
          </span>
        </div>
        {totalCount > 0 && (
          <span className="text-xs text-gray-400">
            {totalCount} {totalCount === 1 ? "image" : "images"}
          </span>
        )}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {/* Existing images */}
        {existingImages.map((url, i) => (
          <div
            key={`existing-${i}`}
            className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
          >
            <img
              src={url}
              alt={`${label} ${i + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all" />
            <button
              type="button"
              onClick={() => onDeleteExisting(i)}
              className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow"
              title="Delete image"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full pointer-events-none">
              Saved
            </span>
          </div>
        ))}

        {/* New (staged) images */}
        {newImages.map((img, i) => (
          <div
            key={`new-${i}`}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-green-400 bg-white shadow-sm"
          >
            <img
              src={img.preview}
              alt={`new-${label}-${i}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all" />
            <button
              type="button"
              onClick={() => onRemoveNew(i)}
              className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow"
              title="Remove"
            >
              <X className="w-3 h-3" />
            </button>
            <span className="absolute bottom-1 left-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full pointer-events-none">
              New
            </span>
          </div>
        ))}

        {/* Add tile */}
        <label
          htmlFor={inputId}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">Add</span>
        </label>
      </div>

      {/* Empty state */}
      {totalCount === 0 && (
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all text-gray-400 hover:text-blue-500"
        >
          <ImagePlus className="w-7 h-7 mb-2" />
          <span className="text-sm font-medium">Upload images</span>
          <span className="text-xs mt-0.5 text-gray-400">
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
        onChange={(e) => e.target.files && onAddNew(e.target.files)}
      />
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function UpdateMicrositeForm({
  microsite,
  onSuccess,
}: UpdateMicrositeFormProps) {
  const { update } = useMicroSites();

  const [existingImages, setExistingImages] = useState<{
    banner?: string;
    physicalImg?: string;
    digitalImg?: string;
    physicalBulkImg?: string;
    digitalBulkImg?: string;
    marketingImgs?: {
      brandAssets?: string[];
      campaignsAndPromos?: string[];
      socialContent?: string[];
      participationContent?: string[];
    };
  }>({});


  const form = useForm<MicrositeFormValues>({
    resolver: zodResolver(micrositeSchema),
    defaultValues: {
      name: "",
      type: "consumer",
      email: "",
      phone: "",
      banner: null,
      aboutDesc: "",
      socialLinks: {
        facebook: "",
        instagram: "",
        x: "",
        website: "",
        youtube: "",
      },
      digitalCardOrderLink: "",
      physicalCardOrderLink: "",
      communityLink: "",
      businessLink: "",
      marketingImgs_brandAssets: [],
      marketingImgs_campaignsAndPromos: [],
      marketingImgs_socialContent: [],
      marketingImgs_participationContent: [],
      marketingVids: [],
      physicalImg: null,
      digitalImg: null,
      physicalBulkImg: null,
      digitalBulkImg: null,
      color: "red",
      isPromotional: false,
      isActive: true,
    },
  });

  useEffect(() => {
    setExistingImages({
      banner: microsite.banner,
      physicalImg: microsite.physicalImg,
      digitalImg: microsite.digitalImg,
      physicalBulkImg: microsite.physicalBulkImg,
      digitalBulkImg: microsite.digitalBulkImg,
      marketingImgs: microsite.marketingImgs
        ? {
            brandAssets: microsite.marketingImgs.brandAssets ?? [],
            campaignsAndPromos: microsite.marketingImgs.campaignsAndPromos ?? [],
            socialContent: microsite.marketingImgs.socialContent ?? [],
            participationContent: microsite.marketingImgs.participationContent ?? [],
          }
        : undefined,
    });

    form.reset({
      name: microsite.name || "",
      type: microsite.type || "consumer",
      email: microsite.email || "",
      phone: microsite.phone || "",
      aboutDesc: microsite.aboutDesc || "",
      socialLinks: {
        facebook: microsite.socialLinks?.facebook || "",
        instagram: microsite.socialLinks?.instagram || "",
        x: microsite.socialLinks?.x || "",
        website: microsite.socialLinks?.website || "",
        youtube: microsite.socialLinks?.youtube || "",
      },
      digitalCardOrderLink: microsite.digitalCardOrderLink || "",
      physicalCardOrderLink: microsite.physicalCardOrderLink || "",
      communityLink: microsite.communityLink || "",
      businessLink: microsite.businessLink || "",
      color: microsite.color || "red",
      isPromotional: microsite.isPromotional ?? false,
      isActive: microsite.isActive ?? true,
      banner: null,
      physicalImg: null,
      digitalImg: null,
      physicalBulkImg: null,
      digitalBulkImg: null,
      marketingImgs_brandAssets: [],
      marketingImgs_campaignsAndPromos: [],
      marketingImgs_socialContent: [],
      marketingImgs_participationContent: [],
    });
  }, [microsite, form]);

  // Delete an existing (saved) marketing image by section
  const deleteExistingMarketingImg = (
    section: "brandAssets" | "campaignsAndPromos" | "socialContent" | "participationContent",
    index: number,
  ) => {
    // Remove from local display — remaining URLs are sent to backend on submit
    setExistingImages((prev) => ({
      ...prev,
      marketingImgs: {
        ...prev.marketingImgs,
        [section]: prev.marketingImgs?.[section]?.filter((_, i) => i !== index) ?? [],
      },
    }));
  };

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("color", values.color);
      formData.append("isPromotional", String(values.isPromotional));
      formData.append("isActive", String(values.isActive));

      const optionalFields = [
        "email",
        "phone",
        "aboutDesc",
        "communityLink",
        "businessLink",
        "physicalCardOrderLink",
        "digitalCardOrderLink",
      ];

      optionalFields.forEach((field) => {
        const value = values[field as keyof MicrositeFormValues];
        if (value) formData.append(field, String(value));
      });

      if (values.banner) formData.append("banner", values.banner);
      if (values.physicalImg) formData.append("physicalImg", values.physicalImg);
      if (values.digitalImg) formData.append("digitalImg", values.digitalImg);
      if (values.physicalBulkImg)
        formData.append("physicalBulkImg", values.physicalBulkImg);
      if (values.digitalBulkImg)
        formData.append("digitalBulkImg", values.digitalBulkImg);

      // New marketing image files
      values.marketingImgs_brandAssets?.forEach((img) =>
        formData.append("marketingImgs_brandAssets", img.file),
      );
      values.marketingImgs_campaignsAndPromos?.forEach((img) =>
        formData.append("marketingImgs_campaignsAndPromos", img.file),
      );
      values.marketingImgs_socialContent?.forEach((img) =>
        formData.append("marketingImgs_socialContent", img.file),
      );
      values.marketingImgs_participationContent?.forEach((img) =>
        formData.append("marketingImgs_participationContent", img.file),
      );

      // Send the remaining existing URLs for each section so the backend
      // knows exactly which saved images to keep (after any deletions).
      formData.append(
        "remainingBrandAssets",
        JSON.stringify(existingImages.marketingImgs?.brandAssets ?? []),
      );
      formData.append(
        "remainingCampaignsAndPromos",
        JSON.stringify(existingImages.marketingImgs?.campaignsAndPromos ?? []),
      );
      formData.append(
        "remainingSocialContent",
        JSON.stringify(existingImages.marketingImgs?.socialContent ?? []),
      );
      formData.append(
        "remainingParticipationContent",
        JSON.stringify(existingImages.marketingImgs?.participationContent ?? []),
      );

      formData.append("socialLinks", JSON.stringify(values.socialLinks));

      await update(microsite.id, formData);

      toast.success("Microsite updated successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error updating microsite",
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Basic Info ── */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Default Microsite" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Banner ── */}
        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner</FormLabel>
              <FormControl>
                <SingleImageUpload
                  id="banner"
                  label="Banner"
                  existingUrl={existingImages.banner}
                  newFile={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aboutDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="This is a default microsite created to showcase..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        {/* ── Social Links ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Social Links
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(form.watch("socialLinks") || {}).map((platform) => (
              <FormField
                key={platform}
                control={form.control}
                name={`socialLinks.${platform}` as Path<MicrositeFormValues>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{platform}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`https://${platform}.com/yourpage`}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <hr />

        {/* ── Other Links ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Other Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="digitalCardOrderLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Card Order Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="physicalCardOrderLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Card Order Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {microsite.type === "consumer" && (
              <FormField
                control={form.control}
                name="communityLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Community Link{" "}
                      <span className="text-orange-500 font-normal">(Consumer)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {microsite.type === "consumer" && (
              <FormField
                control={form.control}
                name="businessLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Register Business{" "}
                      <span className="text-orange-500 font-normal">(Consumer)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* ── Marketing Images ── */}
        {microsite.type === "business" && (
          <>
            <hr />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Marketing Images
              </h3>

              {/* Brand Assets */}
              <FormField
                control={form.control}
                name="marketingImgs_brandAssets"
                render={({ field }) => {
                  const newImages: { file: File; preview: string }[] =
                    field.value || [];
                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label="Brand Assets"
                          inputId="marketingImgs_brandAssets"
                          existingImages={
                            existingImages.marketingImgs?.brandAssets ?? []
                          }
                          newImages={newImages}
                          onDeleteExisting={(i) =>
                            deleteExistingMarketingImg("brandAssets", i)
                          }
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...newImages, ...added]);
                          }}
                          onRemoveNew={(i) =>
                            field.onChange(newImages.filter((_, idx) => idx !== i))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Campaigns & Promos */}
              <FormField
                control={form.control}
                name="marketingImgs_campaignsAndPromos"
                render={({ field }) => {
                  const newImages: { file: File; preview: string }[] =
                    field.value || [];
                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label="Campaigns & Promos"
                          inputId="marketingImgs_campaignsAndPromos"
                          existingImages={
                            existingImages.marketingImgs?.campaignsAndPromos ?? []
                          }
                          newImages={newImages}
                          onDeleteExisting={(i) =>
                            deleteExistingMarketingImg("campaignsAndPromos", i)
                          }
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...newImages, ...added]);
                          }}
                          onRemoveNew={(i) =>
                            field.onChange(newImages.filter((_, idx) => idx !== i))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Social Content */}
              <FormField
                control={form.control}
                name="marketingImgs_socialContent"
                render={({ field }) => {
                  const newImages: { file: File; preview: string }[] =
                    field.value || [];
                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label="Social Content"
                          inputId="marketingImgs_socialContent"
                          existingImages={
                            existingImages.marketingImgs?.socialContent ?? []
                          }
                          newImages={newImages}
                          onDeleteExisting={(i) =>
                            deleteExistingMarketingImg("socialContent", i)
                          }
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...newImages, ...added]);
                          }}
                          onRemoveNew={(i) =>
                            field.onChange(newImages.filter((_, idx) => idx !== i))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Participation Content */}
              <FormField
                control={form.control}
                name="marketingImgs_participationContent"
                render={({ field }) => {
                  const newImages: { file: File; preview: string }[] =
                    field.value || [];
                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label="Participation Content"
                          inputId="marketingImgs_participationContent"
                          existingImages={
                            existingImages.marketingImgs?.participationContent ?? []
                          }
                          newImages={newImages}
                          onDeleteExisting={(i) =>
                            deleteExistingMarketingImg("participationContent", i)
                          }
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...newImages, ...added]);
                          }}
                          onRemoveNew={(i) =>
                            field.onChange(newImages.filter((_, idx) => idx !== i))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </>
        )}

        {/* ── Color Theme ── */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Microsite Color Theme</FormLabel>
              <FormControl>
                <div className="grid grid-cols-7 gap-3 mt-2">
                  {Object.entries(colors).map(([key, gradient]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={cn(
                        "h-10 rounded-lg transition-all",
                        gradient,
                        field.value === key
                          ? "ring-2 ring-offset-2 ring-gray-400 scale-105"
                          : "opacity-80 hover:opacity-100",
                      )}
                      aria-label={key}
                    />
                  ))}
                </div>
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Selected:{" "}
                <span className="font-medium capitalize">{field.value}</span>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        {/* ── Card Images ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Card Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="physicalImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Image</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      id="physicalImg"
                      label="Physical Image"
                      existingUrl={existingImages.physicalImg}
                      newFile={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="digitalImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Image</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      id="digitalImg"
                      label="Digital Image"
                      existingUrl={existingImages.digitalImg}
                      newFile={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="physicalBulkImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Bulk Image</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      id="physicalBulkImg"
                      label="Physical Bulk Image"
                      existingUrl={existingImages.physicalBulkImg}
                      newFile={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="digitalBulkImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Bulk Image</FormLabel>
                  <FormControl>
                    <SingleImageUpload
                      id="digitalBulkImg"
                      label="Digital Bulk Image"
                      existingUrl={existingImages.digitalBulkImg}
                      newFile={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <hr />

        <FormField
          control={form.control}
          name="isPromotional"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0 cursor-pointer">
                Promotional Microsite{" "}
                <span className="text-gray-500 font-normal text-xs">
                  (hides Purchase Cards, Card Stocks, and "How can I get a
                  card" FAQ)
                </span>
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0 cursor-pointer">
                Active{" "}
                <span className="text-gray-500 font-normal text-xs">
                  (inactive microsites return 404)
                </span>
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
