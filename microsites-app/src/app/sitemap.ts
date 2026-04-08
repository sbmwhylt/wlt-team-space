import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

type Microsite = {
  slug: string;
  type: "business" | "consumer";
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/business`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/microsites`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return staticPages;

    const data = await res.json();
    const microsites: Microsite[] = data.microsites ?? [];

    const dynamicPages: MetadataRoute.Sitemap = microsites.map((m) => ({
      url: `${SITE_URL}/${m.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...dynamicPages];
  } catch {
    return staticPages;
  }
}
