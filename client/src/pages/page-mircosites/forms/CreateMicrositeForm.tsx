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
  mapLink: z.string().url().optional().or(z.literal("")),
  businessLink: z.string().url().optional().or(z.literal("")),
  marketingImgs: z.array(z.any()).optional(),
  marketingVids: z.array(z.any()).optional(),
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
      mapLink: "",
      businessLink: "",
      marketingImgs: [],
      marketingVids: [],
    },
  });

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();
      // Required fields
      formData.append("name", values.name);
      formData.append("type", values.type);
      // Optional text fields - loop through them
      const optionalFields = [
        "aboutDesc",
        "digitalCardOrderLink",
        "physicalCardOrderLink",
        "communityLink",
        "mapLink",
      ];
      optionalFields.forEach((field) => {
        const value = values[field as keyof MicrositeFormValues];
        if (value) formData.append(field, String(value));
      });
      // Files
      if (values.banner) formData.append("banner", values.banner);
      // Marketing images
      if (values.marketingImgs?.length) {
        values.marketingImgs.forEach((img) => {
          formData.append("marketingImgs", img.file);
        });
      }
      // Social links as JSON
      formData.append("socialLinks", JSON.stringify(values.socialLinks));
      await create(formData);
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
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
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
            name="mapLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Store Location{" "}
                  <span className="text-orange-500">(Consumer)</span>
                </FormLabel>
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
        </div>

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

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
