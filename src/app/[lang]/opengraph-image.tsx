import {
  buildSocialPreviewImage,
  getSocialPreviewAlt,
  socialPreviewContentType,
  socialPreviewSize,
} from "@/lib/seo/social-preview";
import type { PortfolioLocale } from "@/types/portfolio";
import { notFound } from "next/navigation";

export const alt = getSocialPreviewAlt("en");
export const size = socialPreviewSize;
export const contentType = socialPreviewContentType;

interface LocaleImageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function LocaleOpenGraphImage({ params }: LocaleImageProps) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  const locale: PortfolioLocale = "en";

  return buildSocialPreviewImage(locale);
}
