export type MatchMedia = (query: string) => Pick<MediaQueryList, "matches">;

export function getPreferredScrollBehavior(
  matchMedia: MatchMedia = window.matchMedia.bind(window)
): ScrollBehavior {
  return matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
