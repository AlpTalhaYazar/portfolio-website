import { defaultLanguage, supportedLanguages, type Language } from "./config";

export const publicPortfolioLocales = supportedLanguages.filter(
  (locale): locale is Language => locale !== "es"
) as readonly Language[];

export function isSupportedLocale(value: string): value is Language {
  return publicPortfolioLocales.includes(value as Language);
}

export function getLocaleFromPathname(pathname: string): Language {
  const [, maybeLocale] = pathname.split("/");
  return maybeLocale && isSupportedLocale(maybeLocale)
    ? maybeLocale
    : defaultLanguage;
}

export function stripLocaleFromPathname(pathname: string): string {
  const [, maybeLocale, ...rest] = pathname.split("/");

  if (!maybeLocale || !isSupportedLocale(maybeLocale)) {
    return pathname || "/";
  }

  const stripped = `/${rest.join("/")}` || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function buildLocalizedHref(
  locale: Language,
  currentHref: string
): string {
  const url = new URL(currentHref, "https://www.alptalha.dev");
  const pathname = stripLocaleFromPathname(url.pathname);

  const localizedPathname =
    locale === defaultLanguage
      ? pathname
      : pathname === "/"
      ? `/${locale}`
      : `/${locale}${pathname}`;

  return `${localizedPathname}${url.search}${url.hash}`;
}
