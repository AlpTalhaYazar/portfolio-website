import { NotFoundPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { buildNotFoundMetadata } from "@/lib/seo/portfolio-metadata";

export const metadata = buildNotFoundMetadata();

export default function NotFound() {
  const content = getPortfolioContent("tr");

  return <NotFoundPage content={content.notFound} locale="tr" />;
}
