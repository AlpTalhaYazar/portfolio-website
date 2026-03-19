import { getLocaleFromPathname } from "@/lib/i18n/routing";

export function buildRequestContextHeaders(
  incomingHeaders: Headers,
  pathname: string,
  nonce: string
) {
  const requestHeaders = new Headers(incomingHeaders);

  requestHeaders.set("x-locale", getLocaleFromPathname(pathname));
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-nonce", nonce);

  return requestHeaders;
}
