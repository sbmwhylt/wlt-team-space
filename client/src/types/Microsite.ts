export interface MicroSite {
  id: string | number;
  name: string;
  slug: string;
  type?: "consumer" | "business";
  link: string;
  banner?: string;
  logo?: string;
  aboutDesc?: string;
  footerDesc?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  digitalCardOrderLink?: string;
  physicalCardOrderLink?: string;
  communityLink?: string;
  mapLink?: string;
  marketingImgs?: string[];
  marketingVids?: string[];
}
