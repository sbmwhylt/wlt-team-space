"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Path } from "react-hook-form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
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
import { Upload, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { colors } from "@/constants/colors";
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
  marketingImgs_general: z.array(z.any()).optional(),
  marketingImgs_redemption: z.array(z.any()).optional(),
  marketingImgs_loadUp: z.array(z.any()).optional(),
  marketingImgs_occasions: z.array(z.any()).optional(),
  marketingVids: z.array(z.any()).optional(),
  physicalImg: z.any().optional(),
  digitalImg: z.any().optional(),
  physicalBulkImg: z.any().optional(),
  digitalBulkImg: z.any().optional(),
  color: z.enum(Object.keys(colors) as [string, ...string[]]),
});

type MicrositeFormValues = z.infer<typeof micrositeSchema>;

interface UpdateMicrositeFormProps {
  microsite: MicroSite;
  onSuccess?: () => void;
}

export default function UpdateMicrositeForm({
  microsite,
  onSuccess,
}: UpdateMicrositeFormProps) {
  const { update } = useMicroSites();

  // Store existing image URLs
  const [existingImages, setExistingImages] = useState<{
    banner?: string;
    physicalImg?: string;
    digitalImg?: string;
    physicalBulkImg?: string;
    digitalBulkImg?: string;
    marketingImgs?: {
      general?: string[];
      redemption?: string[];
      loadUp?: string[];
      occasions?: string[];
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
      marketingImgs_general: [],
      marketingImgs_redemption: [],
      marketingImgs_loadUp: [],
      marketingImgs_occasions: [],
      marketingVids: [],
      physicalImg: null,
      digitalImg: null,
      physicalBulkImg: null,
      digitalBulkImg: null,
      color: "red",
    },
  });

  // Load existing microsite data
  useEffect(() => {
    // Set existing images for display
    setExistingImages({
      banner: microsite.banner,
      physicalImg: microsite.physicalImg,
      digitalImg: microsite.digitalImg,
      physicalBulkImg: microsite.physicalBulkImg,
      digitalBulkImg: microsite.digitalBulkImg,
      marketingImgs: microsite.marketingImgs || undefined,
    });

    // Pre-fill form with existing data
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
      // Don't pre-fill file fields
      banner: null,
      physicalImg: null,
      digitalImg: null,
      physicalBulkImg: null,
      digitalBulkImg: null,
      marketingImgs_general: [],
      marketingImgs_redemption: [],
      marketingImgs_loadUp: [],
      marketingImgs_occasions: [],
    });
  }, [microsite, form]);

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("color", values.color);

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

      // Add NEW images only (if user uploaded new ones)
      if (values.banner) formData.append("banner", values.banner);
      if (values.physicalImg)
        formData.append("physicalImg", values.physicalImg);
      if (values.digitalImg) formData.append("digitalImg", values.digitalImg);
      if (values.physicalBulkImg)
        formData.append("physicalBulkImg", values.physicalBulkImg);
      if (values.digitalBulkImg)
        formData.append("digitalBulkImg", values.digitalBulkImg);

      // Add NEW marketing images by section
      if (values.marketingImgs_general?.length) {
        values.marketingImgs_general.forEach((img) => {
          formData.append("marketingImgs_general", img.file);
        });
      }

      if (values.marketingImgs_redemption?.length) {
        values.marketingImgs_redemption.forEach((img) => {
          formData.append("marketingImgs_redemption", img.file);
        });
      }

      if (values.marketingImgs_loadUp?.length) {
        values.marketingImgs_loadUp.forEach((img) => {
          formData.append("marketingImgs_loadUp", img.file);
        });
      }

      if (values.marketingImgs_occasions?.length) {
        values.marketingImgs_occasions.forEach((img) => {
          formData.append("marketingImgs_occasions", img.file);
        });
      }

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center gap-2 w-full">
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

        {/* Banner Upload */}
        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Banner</FormLabel>
              <FormControl>
                <div>
                  {/* Show existing banner if no new file */}
                  {!field.value && existingImages.banner ? (
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden mb-2">
                      <img
                        src={existingImages.banner}
                        alt="Current banner"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Current
                      </div>
                    </div>
                  ) : null}

                  {!field.value ? (
                    <label
                      htmlFor="banner"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        {existingImages.banner
                          ? "Upload New Banner"
                          : "Click to upload Banner"}
                      </span>
                      <Input
                        id="banner"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="New preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                      <button
                        type="button"
                        onClick={() => field.onChange(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
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

        {/* Social Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>
          <div className="grid grid-cols-2 gap-2 pb-4">
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
        <h3 className="text-lg ">Other Details</h3>

        <div className="grid grid-cols-2 gap-2">
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
                    <span className="text-orange-500">(Consumer)</span>{" "}
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
                    <span className="text-orange-500">(Consumer)</span>{" "}
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

        {/* Marketing Images - General */}
        {microsite.type === "business" && (
          <FormField
            control={form.control}
            name="marketingImgs_general"
            render={({ field }) => {
              const images: { file: File; preview: string }[] =
                field.value || [];

              return (
                <FormItem>
                  <FormLabel>
                    Marketing Images - General{" "}
                    <span className="text-blue-500">(Business)</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {/* Show existing images */}
                      {existingImages.marketingImgs?.general?.length ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Current images:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {existingImages.marketingImgs.general.map(
                              (img, i) => (
                                <div
                                  key={i}
                                  className="relative w-full h-24 border rounded-md overflow-hidden"
                                >
                                  <img
                                    src={img}
                                    alt={`current-general-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Current
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Input
                        id="marketingImgs_general"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newImages = files.map((file) => ({
                            file,
                            preview: URL.createObjectURL(file),
                          }));
                          field.onChange([...images, ...newImages]);
                        }}
                      />

                      {images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            New images to upload:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {images.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-24 border rounded-md overflow-hidden"
                              >
                                <img
                                  src={img.preview}
                                  alt={`new-general-${i}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                  New
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = images.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    field.onChange(updated);
                                  }}
                                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {/* Marketing Images - Redemption */}
        {microsite.type === "business" && (
          <FormField
            control={form.control}
            name="marketingImgs_redemption"
            render={({ field }) => {
              const images: { file: File; preview: string }[] =
                field.value || [];

              return (
                <FormItem>
                  <FormLabel>
                    Marketing Images - Redemption{" "}
                    <span className="text-blue-500">(Business)</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {existingImages.marketingImgs?.redemption?.length ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Current images:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {existingImages.marketingImgs.redemption.map(
                              (img, i) => (
                                <div
                                  key={i}
                                  className="relative w-full h-24 border rounded-md overflow-hidden"
                                >
                                  <img
                                    src={img}
                                    alt={`current-redemption-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Current
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Input
                        id="marketingImgs_redemption"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newImages = files.map((file) => ({
                            file,
                            preview: URL.createObjectURL(file),
                          }));
                          field.onChange([...images, ...newImages]);
                        }}
                      />

                      {images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            New images to upload:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {images.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-24 border rounded-md overflow-hidden"
                              >
                                <img
                                  src={img.preview}
                                  alt={`new-redemption-${i}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                  New
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = images.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    field.onChange(updated);
                                  }}
                                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {/* Marketing Images - Load Up */}
        {microsite.type === "business" && (
          <FormField
            control={form.control}
            name="marketingImgs_loadUp"
            render={({ field }) => {
              const images: { file: File; preview: string }[] =
                field.value || [];

              return (
                <FormItem>
                  <FormLabel>
                    Marketing Images - Load Up{" "}
                    <span className="text-blue-500">(Business)</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {existingImages.marketingImgs?.loadUp?.length ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Current images:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {existingImages.marketingImgs.loadUp.map(
                              (img, i) => (
                                <div
                                  key={i}
                                  className="relative w-full h-24 border rounded-md overflow-hidden"
                                >
                                  <img
                                    src={img}
                                    alt={`current-loadup-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Current
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Input
                        id="marketingImgs_loadUp"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newImages = files.map((file) => ({
                            file,
                            preview: URL.createObjectURL(file),
                          }));
                          field.onChange([...images, ...newImages]);
                        }}
                      />

                      {images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            New images to upload:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {images.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-24 border rounded-md overflow-hidden"
                              >
                                <img
                                  src={img.preview}
                                  alt={`new-loadup-${i}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                  New
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = images.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    field.onChange(updated);
                                  }}
                                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        {/* Marketing Images - Occasions */}
        {microsite.type === "business" && (
          <FormField
            control={form.control}
            name="marketingImgs_occasions"
            render={({ field }) => {
              const images: { file: File; preview: string }[] =
                field.value || [];

              return (
                <FormItem>
                  <FormLabel>
                    Marketing Images - Occasions{" "}
                    <span className="text-blue-500">(Business)</span>
                  </FormLabel>
                  <FormControl>
                    <div>
                      {existingImages.marketingImgs?.occasions?.length ? (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">
                            Current images:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {existingImages.marketingImgs.occasions.map(
                              (img, i) => (
                                <div
                                  key={i}
                                  className="relative w-full h-24 border rounded-md overflow-hidden"
                                >
                                  <img
                                    src={img}
                                    alt={`current-occasions-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                                    Current
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ) : null}

                      <Input
                        id="marketingImgs_occasions"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newImages = files.map((file) => ({
                            file,
                            preview: URL.createObjectURL(file),
                          }));
                          field.onChange([...images, ...newImages]);
                        }}
                      />

                      {images.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">
                            New images to upload:
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {images.map((img, i) => (
                              <div
                                key={i}
                                className="relative w-full h-24 border rounded-md overflow-hidden"
                              >
                                <img
                                  src={img.preview}
                                  alt={`new-occasions-${i}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                  New
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = images.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    field.onChange(updated);
                                  }}
                                  className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="mt-7 mb-7">
              <FormLabel>Microsite Color Theme</FormLabel>
              <FormControl>
                <div className="grid grid-cols-7 gap-3 mt-2">
                  {Object.entries(colors).map(([key, gradient]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={`
                h-10 rounded-lg transition-all
                ${gradient}
                ${
                  field.value === key
                    ? "ring-2 ring-offset-2 ring-gray-400 scale-105"
                    : "opacity-80 hover:opacity-100"
                }
              `}
                      aria-label={key}
                    />
                  ))}
                </div>
              </FormControl>
              <p className="text-xs text-gray-500 mt-1">
                Selected:{" "}
                <span className="font-medium capitalize ">{field.value}</span>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <h3 className="text-lg font-medium">Card Images</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Physical Image */}
          <FormField
            control={form.control}
            name="physicalImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Physical Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value && existingImages.physicalImg ? (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden mb-2">
                        <img
                          src={existingImages.physicalImg}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Current
                        </div>
                      </div>
                    ) : null}

                    {!field.value ? (
                      <label
                        htmlFor="physicalImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {existingImages.physicalImg
                            ? "Upload New Image"
                            : "Upload Physical Image"}
                        </span>
                        <Input
                          id="physicalImg"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="New preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                        <button
                          type="button"
                          onClick={() => field.onChange(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Digital Image */}
          <FormField
            control={form.control}
            name="digitalImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Digital Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value && existingImages.digitalImg ? (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden mb-2">
                        <img
                          src={existingImages.digitalImg}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Current
                        </div>
                      </div>
                    ) : null}

                    {!field.value ? (
                      <label
                        htmlFor="digitalImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {existingImages.digitalImg
                            ? "Upload New Image"
                            : "Upload Digital Image"}
                        </span>
                        <Input
                          id="digitalImg"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="New preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                        <button
                          type="button"
                          onClick={() => field.onChange(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Physical Bulk Image */}
          <FormField
            control={form.control}
            name="physicalBulkImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Physical Bulk Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value && existingImages.physicalBulkImg ? (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden mb-2">
                        <img
                          src={existingImages.physicalBulkImg}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Current
                        </div>
                      </div>
                    ) : null}

                    {!field.value ? (
                      <label
                        htmlFor="physicalBulkImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {existingImages.physicalBulkImg
                            ? "Upload New Image"
                            : "Upload Physical Bulk Image"}
                        </span>
                        <Input
                          id="physicalBulkImg"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="New preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                        <button
                          type="button"
                          onClick={() => field.onChange(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Digital Bulk Image */}
          <FormField
            control={form.control}
            name="digitalBulkImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Digital Bulk Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value && existingImages.digitalBulkImg ? (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden mb-2">
                        <img
                          src={existingImages.digitalBulkImg}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Current
                        </div>
                      </div>
                    ) : null}

                    {!field.value ? (
                      <label
                        htmlFor="digitalBulkImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          {existingImages.digitalBulkImg
                            ? "Upload New Image"
                            : "Upload Digital Bulk Image"}
                        </span>
                        <Input
                          id="digitalBulkImg"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </label>
                    ) : (
                      <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(field.value)}
                          alt="New preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          New
                        </div>
                        <button
                          type="button"
                          onClick={() => field.onChange(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
