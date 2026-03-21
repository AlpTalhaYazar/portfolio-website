import { NotFoundPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";

export default function NotFound() {
  const content = getPortfolioContent("tr");

  return <NotFoundPage content={content.notFound} locale="tr" />;
}
