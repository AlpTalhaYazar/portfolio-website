import { NotFoundPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";

export default function NotFound() {
  const content = getPortfolioContent("en");

  return <NotFoundPage content={content.notFound} locale="en" />;
}
