import { PortfolioPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { buildPortfolioMetadata } from "@/lib/seo/portfolio-metadata";

export const metadata = buildPortfolioMetadata("en");

export default function HomePage() {
  return <PortfolioPage content={getPortfolioContent("en")} locale="en" />;
}
