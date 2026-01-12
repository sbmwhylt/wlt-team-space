export interface MicroSite {
  id: string | number;
  name: string;
  slug: string;
  type?: "consumer" | "business";
  email?: string;
  phone?: string;
  banner?: string;
  aboutDesc?: string;
  socialLinks?: {
    facebook?: string;
    x?: string;
    website?: string;
    instagram?: string;
    youtube?: string;
  };
  digitalCardOrderLink?: string;
  physicalCardOrderLink?: string;
  communityLink?: string;
  mapLink?: string;
  businessLink?: string;
  marketingImgs: string[];
  marketingVids?: string[];
}
