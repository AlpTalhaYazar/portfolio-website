import { notFound } from "next/navigation";

import { isSupportedLocale } from "@/lib/i18n/routing";

interface LocaleCatchAllPageProps {
  params: Promise<{
    lang: string;
    slug: string[];
  }>;
}

export default async function LocaleCatchAllPage({
  params,
}: LocaleCatchAllPageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang) || lang === "tr") {
    notFound();
  }

  notFound();
}
