"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

const micrositeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  link: z.string().url("Must be a valid URL"),
  type: z.enum(["consumer", "business"]),
  banner: z.any().optional(),
  logo: z.any().optional(),
  aboutDesc: z.string().optional(),
  footerDesc: z.string().optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
  digitalCardOrderLink: z.string().url().optional().or(z.literal("")),
  physicalCardOrderLink: z.string().url().optional().or(z.literal("")),
  bulkOrderLink: z.string().url().optional().or(z.literal("")),
  communityLink: z.string().url().optional().or(z.literal("")),
  mapLink: z.string().url().optional().or(z.literal("")),
  marketingImgs: z.array(z.any()).optional(),
  marketingVids: z.array(z.any()).optional(),
});

type MicrositeFormValues = z.infer<typeof micrositeSchema>;

export default function CreateMicrositeForm() {
  const [open, setOpen] = useState(false);
  const { create } = useMicroSites();

  const form = useForm<MicrositeFormValues>({
    resolver: zodResolver(micrositeSchema),
    defaultValues: {
      name: "",
      link: "",
      type: "consumer",
      banner: null,
      logo: null,
      aboutDesc: "",
      footerDesc: "",
      socialLinks: {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
        youtube: "",
      },
      digitalCardOrderLink: "",
      physicalCardOrderLink: "",
      bulkOrderLink: "",
      communityLink: "",
      mapLink: "",
      marketingImgs: [],
      marketingVids: [],
    },
  });

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      console.log("Submitting values:", values);

      // Prepare form data for file uploads
      const formData = new FormData();

      // Append all simple fields
      Object.keys(values).forEach((key) => {
        if (key === "banner" && values.banner) {
          formData.append("banner", values.banner);
        } else if (key === "logo" && values.logo) {
          formData.append("logo", values.logo);
        } else if (key === "socialLinks") {
          // Handle nested socialLinks object
          Object.entries(values.socialLinks).forEach(
            ([socialKey, socialValue]) => {
              if (socialValue) {
                formData.append(`socialLinks[${socialKey}]`, socialValue);
              }
            }
          );
        } else if (key === "marketingImgs" && values.marketingImgs) {
          // Handle multiple marketing images
          values.marketingImgs.forEach((img, index) => {
            if (img.file) {
              formData.append(`marketingImgs`, img.file);
            }
          });
        } else if (
          values[key as keyof MicrositeFormValues] &&
          key !== "marketingVids"
        ) {
          // Append other non-file fields
          formData.append(
            key,
            String(values[key as keyof MicrositeFormValues])
          );
        }
      });

      await create(formData);
      console.log("✅ Microsite created successfully");
      toast.success("Microsite created successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("❌ Error creating microsite:", error);
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
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          {/* Banner Upload */}
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Banner</FormLabel>
                <FormControl>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>

                {field.value && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(field.value)}
                      alt="Banner Preview"
                      className="w-32 h-20 object-cover rounded-md border"
                    />
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Logo Upload */}
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>

                {field.value && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(field.value)}
                      alt="Logo Preview"
                      className="w-16 h-16 object-cover rounded-full border"
                    />
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="footerDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Input footer description here..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Social Links Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Links</h3>
          {Object.keys(form.watch("socialLinks") || {}).map((platform) => (
            <FormField
              key={platform}
              control={form.control}
              name={`socialLinks.${platform}`}
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
              <FormLabel>Community Link</FormLabel>
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
          name="mapLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://maps.app.goo.gl/bLiqMuCoLJNWWJvj9"
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marketing Images</FormLabel>
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
                      // Combine existing images with new ones
                      const existingImages = field.value || [];
                      field.onChange([...existingImages, ...newImages]);
                    }}
                  />

                  {Array.isArray(field.value) && field.value.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {field.value.map((img: any, i: number) => (
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
                              const updated = field.value.filter(
                                (_: any, idx: number) => idx !== i
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
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
