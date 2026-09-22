"use client";

import { useState } from "react";
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
import {
  ImagePlus,
  Info,
  Palette,
  Link2,
  CreditCard,
  Images,
  MapPin,
  Settings2,
  Building2,
  User,
  AtSign,
  Phone,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import StoreLocator from "../components/storeLocator";
import { Spinner } from "@/components/ui/spinner";
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
  isPromotional: z.boolean(),
});

type MicrositeFormValues = z.infer<typeof micrositeSchema>;
interface CreateMicrositeFormProps {
  onSuccess?: () => void;
}

// ─── Field config ────────────────────────────────────────────────────────────
const micrositeTypes = [
  {
    value: "consumer",
    label: "Consumer",
    description: "For cardholders and members",
    icon: User,
    activeClass: "border-orange-400 bg-orange-50 ring-1 ring-orange-200",
    iconClass: "text-orange-500",
  },
  {
    value: "business",
    label: "Business",
    description: "For partner businesses",
    icon: Building2,
    activeClass: "border-blue-400 bg-blue-50 ring-1 ring-blue-200",
    iconClass: "text-blue-500",
  },
] as const;

// ─── Main form ───────────────────────────────────────────────────────────────
export default function CreateMicrositeForm({
  onSuccess,
}: CreateMicrositeFormProps) {
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
      isPromotional: false,
    },
  });

  const type = form.watch("type");

  // Clear the fields of the other type so hidden values are never submitted
  const handleTypeChange = (value: "consumer" | "business") => {
    form.setValue("type", value);

    if (value === "consumer") {
      marketingSections.forEach((section) => form.setValue(section.name, []));
    } else {
      form.setValue("businessLink", "");
      setStoreLocations([]);
    }
  };

  const onSubmit = async (values: MicrositeFormValues) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("color", values.color);
      formData.append("isPromotional", String(values.isPromotional));

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
      marketingSections.forEach((section) => {
        const images = values[section.name];
        if (images?.length) {
          images.forEach((img) => formData.append(section.name, img.file));
        }
      });

      // Social links as JSON
      formData.append("socialLinks", JSON.stringify(values.socialLinks));

      const newMicrosite = await create(formData);

      // THEN create stores if any exist
      if (storeLocations.length > 0) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/stores`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* ── Basic Details ── */}
        <Section
          icon={Info}
          title="Basic Details"
          description="Name, audience and contact information."
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-3">
                    {micrositeTypes.map((option) => {
                      const selected = field.value === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleTypeChange(option.value)}
                          aria-pressed={selected}
                          className={cn(
                            "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                            selected
                              ? option.activeClass
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                          )}
                        >
                          <option.icon
                            className={cn(
                              "mt-0.5 h-4 w-4 shrink-0",
                              selected ? option.iconClass : "text-gray-400",
                            )}
                          />
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-gray-900">
                              {option.label}
                            </span>
                            <span className="block text-xs text-gray-500">
                              {option.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
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

            {type === "consumer" && (
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
        {type === "business" && (
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
                  const images: { file: File; preview: string }[] =
                    field.value || [];

                  return (
                    <FormItem>
                      <FormControl>
                        <MarketingImageSection
                          label={section.label}
                          inputId={section.name}
                          images={images}
                          onAddNew={(files) => {
                            const added = Array.from(files).map((file) => ({
                              file,
                              preview: URL.createObjectURL(file),
                            }));
                            field.onChange([...images, ...added]);
                          }}
                          onRemove={(index) =>
                            field.onChange(images.filter((_, i) => i !== index))
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

        {/* ── Store Locations (consumer only) ── */}
        {type === "consumer" && (
          <Section
            icon={MapPin}
            title="Store Locations"
            description="Places shown on the microsite store locator."
            badge={<TypeBadge type="consumer" label="consumer only" />}
          >
            <StoreLocator onLocationsChange={setStoreLocations} />
          </Section>
        )}

        {/* ── Display Options ── */}
        <Section
          icon={Settings2}
          title="Display Options"
          description="Control which microsite sections are visible."
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
        </Section>

        {/* ── Submit ── */}
        <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-6 py-3 backdrop-blur">
          <p className="text-xs text-gray-500">
            Creating a{" "}
            <span className="font-medium capitalize text-gray-700">{type}</span>{" "}
            microsite
          </p>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : "Create Microsite"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
