import type { Metadata } from "next";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

export const metadata: Metadata = {
  title: "Community Gift Card Programs",
  description:
    "Browse Why Leave Town gift card programs near you — every dollar you spend stays right where it belongs, in your local community.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Why Leave Town — Community Gift Card Programs",
    description:
      "Browse local community gift card programs near you and support your community.",
    type: "website",
    url: SITE_URL,
  },
};

type Microsite = {
  id: number;
  name: string;
  slug: string;
  banner: string;
  type: "business" | "consumer";
};

async function getMicrosites(): Promise<Microsite[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/microsites`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.microsites as Microsite[]).filter(
      (m) => m.type === "consumer",
    );
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const microsites = await getMicrosites();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Why Leave Town",
    url: SITE_URL,
    description:
      "Why Leave Town community gift card programs help you shop local and support your community.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const itemListJsonLd =
    microsites.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Why Leave Town Community Gift Card Programs",
          description:
            "Browse all Why Leave Town community gift card programs across Australia.",
          numberOfItems: microsites.length,
          itemListElement: microsites.map((site, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: site.name,
            url: `${SITE_URL}/${site.slug}`,
            image: site.banner,
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/logo-whyleavetown.png"
          alt="Why Leave Town"
          width={180}
          height={80}
          className="mb-8 object-contain"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Shop local,{" "}
          <span className="text-gray-500">support your community.</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-500">
          Browse Why Leave Town gift card programs near you — every dollar you
          spend stays right where it belongs, in your local community.
        </p>
      </section>

      <div className="mx-auto max-w-6xl border-t border-gray-200 px-6" />

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
          Community Programs
        </h2>

        {microsites.length === 0 ? (
          <p className="rounded-lg border-l-4 border-red-400 bg-red-50 px-4 py-3 text-red-600">
            Could not load programs. Try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {microsites.map((site) => {
              const url = `${SITE_URL}/${site.slug}`;
              return (
                <a
                  key={site.id}
                  href={`/${site.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
                >
                  {/* Banner as avatar */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                    <img
                      src={site.banner}
                      alt={site.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-semibold text-gray-800">
                      {site.name}
                    </span>
                    <span className="truncate text-xs text-gray-400">
                      {url}
                    </span>
                  </div>

                  {/* Arrow */}
                  <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-orange-400">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="py-10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Why Leave Town. All rights reserved.
      </footer>
      <SpeedInsights />
    </main>
  );
}
