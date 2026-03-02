import type { Metadata } from "next";
import MicrositeTemplate from "@/microsite/MicrositeTemplate";
import type { MicroSite } from "@/types/Microsite";

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wlt-microsites.vercel.app";

async function getMicrosite(slug: string): Promise<MicroSite | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/microsites/${slug}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.microsite ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await getMicrosite(slug);

  if (!m) {
    return {
      title: "Program Not Found",
      description: "This community gift card program could not be found.",
    };
  }

  const canonicalUrl = `${SITE_URL}/${slug}`;
  const description =
    m.aboutDesc ||
    `${m.name} gift card program — shop local and support your community with Why Leave Town.`;

  return {
    title: m.name,
    description,
    keywords: [
      m.name,
      "local gift cards",
      "community gift cards",
      "shop local",
      "Why Leave Town",
      "support local",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: m.name,
      description,
      url: canonicalUrl,
      type: "website",
      locale: "en_AU",
      siteName: "Why Leave Town",
      images: m.banner
        ? [{ url: m.banner, width: 1200, height: 630, alt: m.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: m.name,
      description,
      images: m.banner ? [m.banner] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const microsite = await getMicrosite(slug);

  if (!microsite) {
    return <div>Microsite not found</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": microsite.type === "consumer" ? "LocalBusiness" : "Organization",
    name: microsite.name,
    description:
      microsite.aboutDesc ||
      `${microsite.name} community gift card program by Why Leave Town.`,
    url: `${SITE_URL}/${slug}`,
    image: microsite.banner,
    ...(microsite.email && { email: microsite.email }),
    ...(microsite.phone && { telephone: microsite.phone }),
    ...(microsite.socialLinks && {
      sameAs: [
        microsite.socialLinks.website,
        microsite.socialLinks.facebook,
        microsite.socialLinks.instagram,
        microsite.socialLinks.x,
      ].filter(Boolean),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MicrositeTemplate microsite={microsite} />
    </>
  );
}
