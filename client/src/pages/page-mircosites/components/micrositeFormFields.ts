import {
  Globe,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";

// Field config shared by the microsite create/update forms.

export const socialPlatforms = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "x", label: "X (Twitter)", icon: Twitter },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "website", label: "Website", icon: Globe },
] as const;

export const cardImageFields = [
  { name: "physicalImg", label: "Physical Card" },
  { name: "digitalImg", label: "Digital Card" },
  { name: "physicalBulkImg", label: "Physical Bulk" },
  { name: "digitalBulkImg", label: "Digital Bulk" },
] as const;

export const marketingSections = [
  {
    name: "marketingImgs_brandAssets",
    key: "brandAssets",
    label: "Brand Assets",
  },
  {
    name: "marketingImgs_campaignsAndPromos",
    key: "campaignsAndPromos",
    label: "Campaigns & Promos",
  },
  {
    name: "marketingImgs_socialContent",
    key: "socialContent",
    label: "Social Content",
  },
  {
    name: "marketingImgs_participationContent",
    key: "participationContent",
    label: "Participation Content",
  },
] as const;
