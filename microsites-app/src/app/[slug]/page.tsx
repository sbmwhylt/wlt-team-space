import type { Metadata } from "next";
import MicrositeTemplate from "@/microsite/MicrositeTemplate";
import type { MicroSite } from "@/types/Microsite";

type Props = {
  params: Promise<{ slug: string }>;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

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
      description: "This Australian gift card program could not be found.",
    };
  }

  const canonicalUrl = `${SITE_URL}/${slug}`;
  const title = `${m.name} — Australian Gift Cards | Why Leave Town`;
  const description =
    m.aboutDesc ||
    `${m.name} is an Australian gift card program by Why Leave Town — shop local Australia and support your community with every purchase.`;

  return {
    title,
    description,
    keywords: [
      m.name,
      "Australian gift cards",
      "local gift cards",
      "community gift cards",
      "shop local Australia",
      "shop local",
      "Why Leave Town",
      "support local",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
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
      title,
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

  const canonicalUrl = `${SITE_URL}/${slug}`;
  const description =
    microsite.aboutDesc ||
    `${microsite.name} is an Australian gift card program by Why Leave Town. Shop local Australia and support your community with every purchase.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":
          microsite.type === "consumer" ? "LocalBusiness" : "Organization",
        "@id": `${canonicalUrl}#business`,
        name: microsite.name,
        description,
        url: canonicalUrl,
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
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: microsite.name,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How can I get a Why Leave Town Australian gift card?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can purchase a Why Leave Town Australian gift card online or from designated load up stores in your area. It's the easiest way to shop local Australia and support businesses in your community.",
            },
          },
          {
            "@type": "Question",
            name: "Where can I use my Australian gift card?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Your Australian gift card can be spent at any participating local business in the ${microsite.name} program. Look for the "Why Leave Town Gift Cards Accepted Here" badge on shop doors & windows, or check the full list in the Where to Spend section.`,
            },
          },
          {
            "@type": "Question",
            name: "How can I check my card balance?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Visit whyleavetown.com/check-card-balance and enter your card number to see your remaining balance and expiry date instantly.",
            },
          },
          {
            "@type": "Question",
            name: "Can my business be a part of the program?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Absolutely! If you're a local business owner and want to be part of the program, get in touch at info@whyleavetown.com.",
            },
          },
        ],
      },
    ],
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
