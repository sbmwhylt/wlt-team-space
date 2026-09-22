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
import { toast } from "react-hot-toast";
import {
  Info,
  Palette,
  Link2,
  CreditCard,
  Images,
  ImagePlus,
  Settings2,
  AtSign,
  Phone,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { colors } from "@/constants/colors";
import { cn } from "@/lib/utils";
import {
  Section,
  TypeBadge,
  CardLinksNote,
  IconInput,
  SingleImageUpload,
  MarketingImageSection,
} from "../components/micrositeFormUi";
import {
  socialPlatforms,
  cardImageFields,
  marketingSections,
} from "../components/micrositeFormFields";
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
  update: (
    id: string | number,
    data: FormData | Partial<MicroSite>,
  ) => Promise<any>;
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function UpdateMicrositeForm({
  microsite,
  onSuccess,
  update,
}: UpdateMicrositeFormProps) {
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
            campaignsAndPromos:
              microsite.marketingImgs.campaignsAndPromos ?? [],
            socialContent: microsite.marketingImgs.socialContent ?? [],
            participationContent:
              microsite.marketingImgs.participationContent ?? [],
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
    section:
      | "brandAssets"
      | "campaignsAndPromos"
      | "socialContent"
      | "participationContent",
    index: number,
  ) => {
    // Remove from local display — remaining URLs are sent to backend on submit
    setExistingImages((prev) => ({
      ...prev,
      marketingImgs: {
        ...prev.marketingImgs,
        [section]:
          prev.marketingImgs?.[section]?.filter((_, i) => i !== index) ?? [],
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
      if (values.physicalImg)
        formData.append("physicalImg", values.physicalImg);
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
        JSON.stringify(
          existingImages.marketingImgs?.participationContent ?? [],
        ),
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
        {/* ── Basic Details ── */}
        <Section
          icon={Info}
          title="Basic Details"
          description="Name and contact information."
          badge={microsite.type && <TypeBadge type={microsite.type} />}
        >
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <IconInput
                      icon={AtSign}
                      placeholder="hello@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <IconInput
                      icon={Phone}
                      placeholder="(000) 000-0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {/* ── Appearance ── */}
        <Section
          icon={Palette}
          title="Appearance"
          description="How the microsite looks and introduces itself."
        >
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
                    value={field.value}
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
                    rows={4}
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color Theme</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(colors).map(([key, gradient]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => field.onChange(key)}
                        title={key}
                        aria-label={key}
                        aria-pressed={field.value === key}
                        className={cn(
                          "h-9 rounded-lg transition-all",
                          gradient,
                          field.value === key
                            ? "scale-105 ring-2 ring-gray-500 ring-offset-2"
                            : "opacity-70 hover:opacity-100",
                        )}
                      />
                    ))}
                  </div>
                </FormControl>
                <p className="text-xs text-gray-500">
                  Selected:{" "}
                  <span className="font-medium capitalize text-gray-700">
                    {field.value}
                  </span>
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>

        {/* ── Social Links ── */}
        <Section
          icon={Link2}
          title="Social Links"
          description="Optional — leave a field blank to hide that platform."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {socialPlatforms.map((platform) => (
              <FormField
                key={platform.key}
                control={form.control}
                name={
                  `socialLinks.${platform.key}` as Path<MicrositeFormValues>
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{platform.label}</FormLabel>
                    <FormControl>
                      <IconInput
                        icon={platform.icon}
                        placeholder={`https://${platform.key}.com/yourpage`}
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
        </Section>

        {/* ── Action Links ── */}
        <Section
          icon={CreditCard}
          title="Action Links"
          description="Where the microsite buttons send visitors."
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="digitalCardOrderLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Digital Card Order</FormLabel>
                  <FormControl>
                    <IconInput
                      icon={Link2}
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
                  <FormLabel>Physical Card Order</FormLabel>
                  <FormControl>
                    <IconInput
                      icon={Link2}
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardLinksNote className="sm:col-span-2" />

            <FormField
              control={form.control}
              name="communityLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community</FormLabel>
                  <FormControl>
                    <IconInput
                      icon={Link2}
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
                name="businessLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Register Business
                      <TypeBadge type="consumer" label="consumer only" />
                    </FormLabel>
                    <FormControl>
                      <IconInput
                        icon={Link2}
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
        </Section>

        {/* ── Card Images ── */}
        <Section
          icon={Images}
          title="Card Images"
          description="Artwork shown for single and bulk card orders."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cardImageFields.map((card) => (
              <FormField
                key={card.name}
                control={form.control}
                name={card.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{card.label}</FormLabel>
                    <FormControl>
                      <SingleImageUpload
                        id={card.name}
                        label={card.label}
                        existingUrl={existingImages[card.name]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Section>

        {/* ── Marketing Images (business only) ── */}
        {microsite.type === "business" && (
          <Section
            icon={ImagePlus}
            title="Marketing Images"
            description="Grouped assets shown in the business gallery."
            badge={<TypeBadge type="business" label="business only" />}
          >
            {marketingSections.map((section) => (
              <FormField
                key={section.name}
                control={form.control}
                name={section.name}
                render={({ field }) => {
                  const newImages: { file: File; preview: string }[] =
                    field.value || [];

                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label={section.label}
                          inputId={section.name}
                          images={newImages}
                          existingImages={
                            existingImages.marketingImgs?.[section.key] ?? []
                          }
                          onDeleteExisting={(i) =>
                            deleteExistingMarketingImg(section.key, i)
                          }
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...newImages, ...added]);
                          }}
                          onRemove={(index) =>
                            field.onChange(
                              newImages.filter((_, i) => i !== index),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          </Section>
        )}

        {/* ── Display Options ── */}
        <Section
          icon={Settings2}
          title="Display Options"
          description="Control visibility of the microsite and its sections."
        >
          <FormField
            control={form.control}
            name="isPromotional"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
                <FormControl>
                  <Checkbox
                    id="isPromotional"
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="min-w-0 flex-1">
                  <FormLabel
                    htmlFor="isPromotional"
                    className="!mt-0 cursor-pointer"
                  >
                    Promotional Microsite
                  </FormLabel>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Hides Purchase Cards, Card Stocks, and the "How can I get a
                    card" FAQ.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
                <FormControl>
                  <Checkbox
                    id="isActive"
                    className="mt-0.5"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="min-w-0 flex-1">
                  <FormLabel htmlFor="isActive" className="!mt-0 cursor-pointer">
                    Active
                  </FormLabel>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Inactive microsites return a 404 to visitors.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </Section>

        {/* ── Submit ── */}
        <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-6 py-3 backdrop-blur">
          <p className="min-w-0 truncate text-xs text-gray-500">
            Editing{" "}
            <span className="font-medium text-gray-700">{microsite.name}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess?.()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Spinner /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
