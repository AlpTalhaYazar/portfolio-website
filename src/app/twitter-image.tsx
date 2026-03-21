import {
  buildSocialPreviewImage,
  getSocialPreviewAlt,
  socialPreviewContentType,
  socialPreviewSize,
} from "@/lib/seo/social-preview";

export const alt = getSocialPreviewAlt("tr");
export const size = socialPreviewSize;
export const contentType = socialPreviewContentType;

export default function TwitterImage() {
  return buildSocialPreviewImage("tr");
}
