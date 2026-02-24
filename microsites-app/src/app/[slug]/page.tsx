import type { Metadata } from "next";
import MicrositeTemplate from "@/microsite/MicrositeTemplate";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/microsites/${slug}`,
  );

  const data = await res.json();
  const m = data.microsite;
  return {
    title: m.name,
    description: m.aboutDesc,
    openGraph: {
      title: m.name,
      description: m.aboutDesc,
      images: [m.banner],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/microsites/${slug}`;
  console.log("Fetching URL:", url); 
  const res = await fetch(url);
  console.log("Status:", res.status); 
  const data = await res.json();
  if (!data.microsite) {
    return <div>Microsite not found</div>;
  }
  return <MicrositeTemplate microsite={data.microsite} />;
}
