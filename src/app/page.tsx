import { PortfolioPage } from "@/components/portfolio";
import { getPortfolioContent } from "@/lib/content/portfolio";
import { buildPortfolioMetadata } from "@/lib/seo/portfolio-metadata";
import StructuredData from "@/components/utils/StructuredData";

export const metadata = buildPortfolioMetadata("tr");

export default function HomePage() {
  return (
    <>
      <StructuredData locale="tr" />
      <PortfolioPage content={getPortfolioContent("tr")} locale="tr" />
    </>
  );
}
