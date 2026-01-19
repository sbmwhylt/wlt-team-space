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
  marketingImgs: z.array(z.any()).optional(),
  marketingVids: z.array(z.any()).optional(),
  physicalImg: z.any().optional(),
  digitalImg: z.any().optional(),
  physicalBulkImg: z.any().optional(),
  digitalBulkImg: z.any().optional(),
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
      marketingImgs: [],
      marketingVids: [],
      physicalImg: null,
      digitalImg: null,
      physicalBulkImg: null,
      digitalBulkImg: null,
    },
  });

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("name", values.name);
      formData.append("type", values.type);

      // Optional text fields
      const optionalFields = [
        "email",
        "phone",
        "aboutDesc",
        "communityLink",
        "businessLink",
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

      // Marketing images
      if (values.marketingImgs?.length) {
        values.marketingImgs.forEach((img) => {
          formData.append("marketingImgs", img.file);
        });
      }

      // Marketing videos
      if (values.marketingVids?.length) {
        values.marketingVids.forEach((vid) => {
          formData.append("marketingVids", vid.file);
        });
      }

      // Social links as JSON
      formData.append("socialLinks", JSON.stringify(values.socialLinks));

      // Create the microsite FIRST and save the result
      const newMicrosite = await create(formData);

      // THEN create stores if any exist
      if (storeLocations.length > 0) {
        await fetch(`${import.meta.env.VITE_API_URL}/stores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            micrositeId: newMicrosite.id,
            stores: storeLocations,
          }),
        });
      }

      toast.success("Microsite created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating microsite");
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
        </div>

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
          name="marketingImgs"
          render={({ field }) => {
            // Ensure we always work with an array
            const images: { file: File; preview: string }[] = field.value || [];

            return (
              <FormItem>
                <FormLabel>
                  Marketing Images{" "}
                  <span className="text-blue-500">(Business)</span>
                </FormLabel>
                <FormControl>
                  <div>
                    <Input
                      id="marketingImgs"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const newImages = files.map((file) => ({
                          file,
                          preview: URL.createObjectURL(file),
                        }));
                        field.onChange([...images, ...newImages]); // merge with existing
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
                              alt={`preview-${i}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = images.filter(
                                  (_, idx) => idx !== i
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
        <h3 className="text-lg ">Store Locator</h3>
        <StoreLocator onLocationsChange={setStoreLocations} />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
