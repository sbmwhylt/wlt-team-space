"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import StoreLocator from "../components/storeLocator";
import { Spinner } from "@/components/ui/spinner";
import { colors } from "@/constants/colors";

const micrositeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  type: z.enum(["consumer", "business"]),
  email: z.string().email().optional(),
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
  // Split marketing images into sections
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
});

type MicrositeFormValues = z.infer<typeof micrositeSchema>;
interface CreateMicrositeFormProps {
  onSuccess?: () => void;
}

export default function CreateMicrositeForm({
  onSuccess,
}: CreateMicrositeFormProps) {
  const [] = useState(false);
  const { create } = useMicroSites();

  const [storeLocations, setStoreLocations] = useState<
    {
      name: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);

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
      // Split marketing images into sections
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
    },
  });

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("color", values.color);

      // Optional text fields
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

      // Banner file
      if (values.banner) {
        formData.append("banner", values.banner);
      }

      // Card images
      if (values.physicalImg) {
        formData.append("physicalImg", values.physicalImg);
      }
      if (values.digitalImg) {
        formData.append("digitalImg", values.digitalImg);
      }
      if (values.physicalBulkImg) {
        formData.append("physicalBulkImg", values.physicalBulkImg);
      }
      if (values.digitalBulkImg) {
        formData.append("digitalBulkImg", values.digitalBulkImg);
      }

      // Marketing images - by section
      if (values.marketingImgs_brandAssets?.length) {
        values.marketingImgs_brandAssets.forEach((img) => {
          formData.append("marketingImgs_brandAssets", img.file);
        });
      }

      if (values.marketingImgs_campaignsAndPromos?.length) {
        values.marketingImgs_campaignsAndPromos.forEach((img) => {
          formData.append("marketingImgs_campaignsAndPromos", img.file);
        });
      }

      if (values.marketingImgs_socialContent?.length) {
        values.marketingImgs_socialContent.forEach((img) => {
          formData.append("marketingImgs_socialContent", img.file);
        });
      }

      if (values.marketingImgs_participationContent?.length) {
        values.marketingImgs_participationContent.forEach((img) => {
          formData.append("marketingImgs_participationContent", img.file);
        });
      }

      // Social links as JSON
      formData.append("socialLinks", JSON.stringify(values.socialLinks));

      const newMicrosite = await create(formData);

      // THEN create stores if any exist
      if (storeLocations.length > 0) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/stores`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                micrositeId: newMicrosite.id,
                stores: storeLocations.map((store) => ({
                  name: store.name,
                  latitude: String(store.latitude),
                  longitude: String(store.longitude),
                })),
              }),
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create stores");
          }

          const storeResult = await response.json();
          toast.success(`${storeResult.msg || "Stores created successfully!"}`);
        } catch (storeError) {
          console.error("Store creation error:", storeError);
          toast.error("Microsite created but failed to add store locations");
        }
      }

      toast.success("Microsite created successfully!");
      form.reset();
      setStoreLocations([]);
      onSuccess?.();
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error creating microsite",
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

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="consumer" className="text-orange-500">
                    Consumer
                  </SelectItem>
                  <SelectItem value="business" className="text-blue-500">
                    Business
                  </SelectItem>
                </SelectContent>
              </Select>
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
                  {!field.value ? (
                    <label
                      htmlFor="banner"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload Banner
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
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
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
                name={`socialLinks.${platform}` as Path<MicrositeFormValues>} // ✅ cast as Path
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
        </div>

        <hr className="" />
        <h3 className="text-lg ">Marketing Images</h3>

        {/* Marketing Images - brandAssets */}
        <FormField
          control={form.control}
          name="marketingImgs_brandAssets"
          render={({ field }) => {
            const images: { file: File; preview: string }[] = field.value || [];

            return (
              <FormItem>
                <FormLabel>
                  Brand Assets <span className="text-blue-500">(Business)</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="marketingImgs_brandAssets"
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
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-full h-24 border rounded-md overflow-hidden"
                          >
                            <img
                              src={img.preview}
                              alt={`brandAssets-preview-${i}`}
                              className="w-full h-full object-cover"
                            />
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
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Marketing Images - Campaigns and Promos */}
        <FormField
          control={form.control}
          name="marketingImgs_campaignsAndPromos"
          render={({ field }) => {
            const images: { file: File; preview: string }[] = field.value || [];

            return (
              <FormItem>
                <FormLabel>
                  Campaigns and Promos{" "}
                  <span className="text-blue-500">(Business)</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="marketingImgs_campaignsAndPromos"
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
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-full h-24 border rounded-md overflow-hidden"
                          >
                            <img
                              src={img.preview}
                              alt={`campaignsAndPromos-preview-${i}`}
                              className="w-full h-full object-cover"
                            />
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
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Marketing Images - Social Content */}
        <FormField
          control={form.control}
          name="marketingImgs_socialContent"
          render={({ field }) => {
            const images: { file: File; preview: string }[] = field.value || [];

            return (
              <FormItem>
                <FormLabel>
                  Social Content Stores{" "}
                  <span className="text-blue-500">(Business)</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="marketingImgs_socialContent"
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
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-full h-24 border rounded-md overflow-hidden"
                          >
                            <img
                              src={img.preview}
                              alt={`socialContent-preview-${i}`}
                              className="w-full h-full object-cover"
                            />
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
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Marketing Images - Participation Content */}
        <FormField
          control={form.control}
          name="marketingImgs_participationContent"
          render={({ field }) => {
            const images: { file: File; preview: string }[] = field.value || [];

            return (
              <FormItem>
                <FormLabel>
                  Participation Content{" "}
                  <span className="text-blue-500">(Business)</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="marketingImgs_participationContent"
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
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-full h-24 border rounded-md overflow-hidden"
                          >
                            <img
                              src={img.preview}
                              alt={`participationContent-preview-${i}`}
                              className="w-full h-full object-cover"
                            />
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
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

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
          <FormField
            control={form.control}
            name="physicalImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Physical Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value ? (
                      <label
                        htmlFor="physicalImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Physical Image
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
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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
            name="digitalImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Digital Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value ? (
                      <label
                        htmlFor="digitalImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Digital Image
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
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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
            name="physicalBulkImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Physical Bulk Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value ? (
                      <label
                        htmlFor="physicalBulkImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Physical Bulk Image
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
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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
            name="digitalBulkImg"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Digital Bulk Image</FormLabel>
                <FormControl>
                  <div>
                    {!field.value ? (
                      <label
                        htmlFor="digitalBulkImg"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Upload Digital Bulk Image
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
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
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

        <hr />
        <h3 className="text-lg ">
          Store Locator <span className="text-orange-500">(Consumer)</span>{" "}
        </h3>
        <StoreLocator onLocationsChange={setStoreLocations} />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
