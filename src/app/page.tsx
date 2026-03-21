import { PortfolioPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { buildPortfolioMetadata } from "@/lib/seo/portfolio-metadata";

export const metadata = buildPortfolioMetadata("tr");

export default function HomePage() {
  return <PortfolioPage content={getPortfolioContent("tr")} locale="tr" />;
}
