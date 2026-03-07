import {
  buildSocialPreviewImage,
  getSocialPreviewAlt,
  socialPreviewContentType,
  socialPreviewSize,
} from "@/lib/seo/social-preview";

export const alt = getSocialPreviewAlt("en");
export const size = socialPreviewSize;
export const contentType = socialPreviewContentType;

export default function OpenGraphImage() {
  return buildSocialPreviewImage("en");
}
