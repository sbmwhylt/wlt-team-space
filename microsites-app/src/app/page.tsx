import type { Metadata } from "next";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shoplocal.whyleavetown.com";

export const metadata: Metadata = {
  title: "Shop Local Gift Cards in Australia | Why Leave Town",
  description:
    "Support small businesses across Australia. Browse Why Leave Town gift cards in your community and keep every dollar local. Buy online today.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Why Leave Town — Australian Gift Cards & Shop Local Programs",
    description:
      "Browse Australian gift cards and community gift card programs from Why Leave Town. Shop local Australia and support your community.",
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
      "Why Leave Town offers Australian gift cards and community gift card programs to help you shop local Australia and support your community.",
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
          name: "Why Leave Town Australian Gift Card Programs",
          description:
            "Browse all Why Leave Town Australian gift cards and community gift card programs across Australia.",
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
      <section className="relative overflow-hidden bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 scroll-smooth">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
          <div className="rounded-full object-fit overflow-hidden mb-14 border-10 border-orange-400/80">
            {" "}
            <Image
              src="/logo-whyleavetown.png"
              alt="Why Leave Town"
              width={180}
              height={80}
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Shop Local Gift Cards
            <span className="mt-2 block bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              in Australia
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Support small businesses across Australia by purchasing local gift
            cards. Every dollar you spend stays in your community, helping
            cafes, shops, and service providers grow and thrive.
          </p>
          <a
            href="#programs"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Browse Communities
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
              />
            </svg>
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-[#fafaf8] to-transparent" />
      </section>

      {/* Community Programs */}
      <section
        id="programs"
        className="mx-auto bg-white px-6 py-16 sm:py-24 scroll-mt-8 "
      >
        <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mx-auto max-w-6xl">
          <div>
            <span className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-orange-600">
              Community Programs
            </span>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Find Your Community
            </h2>
          </div>
          {microsites.length > 0 && (
            <p className="mt-2 text-sm text-gray-500 sm:mt-0">
              {microsites.length} programs across Australia
            </p>
          )}
        </div>

        {microsites.length === 0 ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
            Could not load programs. Try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {microsites.map((site) => {
              return (
                <a
                  key={site.id}
                  href={`/${site.slug}`}
                  target="_blank"
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={site.banner}
                      alt={site.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="flex flex-1 items-center justify-between gap-3 px-5 py-4">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition">
                        {site.name}
                      </span>
                      <p className="text-xs text-gray-500">
                        Discover local gift cards in {site.name} and support
                        your community.
                      </p>
                    </div>

                    <span className="shrink-0 text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-orange-500">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Buy Local */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Buy Local Gift Cards?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Buying local gift cards is more than a gift — it strengthens your
            community. When you purchase a gift card, you directly support
            Australian small businesses, help create jobs, and sustain local
            economies.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-orange-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Support Small Business
            </h3>
            <p className="mt-2 text-gray-600">
              Support Australian small businesses directly
            </p>
          </div>

          <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-orange-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Create Local Jobs
            </h3>
            <p className="mt-2 text-gray-600">
              Help create jobs and sustain local economies
            </p>
          </div>

          <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-orange-200">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Keep It Local
            </h3>
            <p className="mt-2 text-gray-600">
              Keep your spending in your own city or region
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How Why Leave Town Gift Cards Work
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-500 text-xl font-bold text-white shadow-md shadow-orange-500/20">
                1
              </div>
              <h3 className="text-base font-semibold text-gray-900">Browse</h3>
              <p className="mt-2 text-sm text-gray-600">
                Browse your community to see participating businesses.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-500 text-xl font-bold text-white shadow-md shadow-orange-500/20">
                2
              </div>
              <h3 className="text-base font-semibold text-gray-900">Select</h3>
              <p className="mt-2 text-sm text-gray-600">
                Select the gift card you want and choose the value.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-500 text-xl font-bold text-white shadow-md shadow-orange-500/20">
                3
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                Purchase
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Purchase securely online.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-500 text-xl font-bold text-white shadow-md shadow-orange-500/20">
                4
              </div>
              <h3 className="text-base font-semibold text-gray-900">Redeem</h3>
              <p className="mt-2 text-sm text-gray-600">
                The business receives your gift instantly, ready for local use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-linear-to-br from-gray-900 to-gray-800 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Tips for Buying Local Gift Cards
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Choose businesses in your own city to maximize community impact.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Share gift cards with friends and family to support more local
                shops.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Check for special promotions or bundles for extra value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 sm:flex-row sm:justify-between">
          <Image
            src="/logo-whyleavetown.png"
            alt="Why Leave Town"
            width={120}
            height={54}
            className="object-contain opacity-60"
          />
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Why Leave Town. All rights
            reserved.
          </p>
        </div>
      </footer>
      <SpeedInsights />
    </main>
  );
}
