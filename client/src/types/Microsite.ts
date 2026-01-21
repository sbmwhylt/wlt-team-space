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
  businessLink?: string;
  marketingImgs?: {
    general?: string[] | null;
    redemption?: string[] | null;
    loadUp?: string[] | null;
    occasions?: string[] | null;
  } | null;
  marketingVids?: string[];
  physicalImg?: string;
  digitalImg?: string;
  physicalBulkImg?: string;
  digitalBulkImg?: string;
  stores?: Store[];
  color: string;
}

export interface Store {
  id: string | number;
  name: string;
  latitude?: number;
  longitude?: number;
  micrositeId: string | number;
}
