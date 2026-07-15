const HTML_ENTITIES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

export function escapeHtmlWithLineBreaks(value: string): string {
  return escapeHtml(normalizePlainText(value)).replace(/\n/g, "<br/>");
}

export function normalizePlainText(value: string): string {
  return value.replace(/\0/g, "").replace(/\r\n?/g, "\n");
}

export function normalizeHeaderValue(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function safeExternalUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return "#";
    }
    return escapeHtml(url.toString());
  } catch {
    return "#";
  }
}

export function safeMailto(value: string): string {
  const normalized = normalizeHeaderValue(value);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return "#";
  }
  return `mailto:${escapeHtml(normalized)}`;
}
