import {
  buildSocialPreviewImage,
  getSocialPreviewAlt,
  socialPreviewContentType,
  socialPreviewSize,
} from "@/lib/seo/social-preview";
import type { PortfolioLocale } from "@/types/portfolio";

export const alt = getSocialPreviewAlt("tr");
export const size = socialPreviewSize;
export const contentType = socialPreviewContentType;

interface LocaleImageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function LocaleOpenGraphImage({ params }: LocaleImageProps) {
  const { lang } = await params;
  const locale: PortfolioLocale = lang === "tr" ? "tr" : "en";

  return buildSocialPreviewImage(locale);
}
