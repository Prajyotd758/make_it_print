import { notFound } from "next/navigation";
import { SERVICES } from "@/components/serviceComponent/data";
import ServiceDetail from "@/components/serviceComponent/ServiceDetail.jsx";

export function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = SERVICES[slug];
  return { title: s ? `${s.title} — Make It Print` : "Services" };
}

export default async function Page({ params }) {
  const { slug } = await params;
  if (!SERVICES[slug]) notFound();
  return <ServiceDetail slug={slug} />;
}
