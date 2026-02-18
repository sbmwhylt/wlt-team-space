import type { Metadata } from "next";
import MicrositeTemplate from "@/microsite/MicrositeTemplate";

type Props = {
  params: Promise<{ type: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params; 
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/microsites/${type}/${slug}`,
  );
  const data = await res.json();
  const m = data.microsite;
  return {
    title: `${m.name} | ${m.type}`,
    description: m.aboutDesc,
    openGraph: {
      title: m.name,
      description: m.aboutDesc,
      images: [m.banner],
    },
  };
}

export default async function Page({ params }: Props) {
  const { type, slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/microsites/${type}/${slug}`,
  );
  const data = await res.json();
  if (!data.microsite) {
    return <div>Microsite not found</div>;
  }
  return <MicrositeTemplate microsite={data.microsite} />;
}
