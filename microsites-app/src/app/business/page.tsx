import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Microsites | Why Leave Town (Internal)",
  robots: { index: false, follow: false },
};

type Microsite = {
  id: number;
  name: string;
  slug: string;
  banner: string;
  type: "business" | "consumer";
};

async function getBusinessMicrosites(): Promise<Microsite[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/microsites`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.microsites as Microsite[]).filter(
      (m) => m.type === "business",
    );
  } catch {
    return [];
  }
}

export default async function BusinessPage() {
  const microsites = await getBusinessMicrosites();

  return (
    <main className="min-h-screen bg-[#fafaf8] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Internal
          </span>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Business Microsites
          </h1>
          {microsites.length > 0 && (
            <p className="mt-1 text-sm text-gray-500">
              {microsites.length} programs
            </p>
          )}
        </div>

        {microsites.length === 0 ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-600">
            Could not load programs. Try again later.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {microsites.map((site) => (
              <a
                key={site.id}
                href={`/${site.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={site.banner}
                    alt={site.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 px-5 py-4">
                  <span className="truncate text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    {site.name}
                  </span>
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-blue-500"
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
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
