"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import type { PortfolioContent } from "@/types/portfolio";

import { SectionLabel } from "./SectionLabel";

interface ProjectsProps {
  content: PortfolioContent["projects"];
}

type ProjectItem = PortfolioContent["projects"]["items"][number];
type InspectableProjectItem = ProjectItem & {
  details: NonNullable<ProjectItem["details"]>;
};

const DESKTOP_QUERY = "(min-width: 1280px)";

export function Projects({ content }: ProjectsProps) {
  const [activeItemNumber, setActiveItemNumber] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const projectRows = createProjectRows(content.items);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const syncViewport = (matches: boolean) => {
      setIsDesktop(matches);
    };

    syncViewport(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      syncViewport(event.matches);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  const toggleItem = (itemNumber: string) => {
    setActiveItemNumber((current) => (current === itemNumber ? null : itemNumber));
  };

  return (
    <section id="projects" className="section-shell border-t border-border">
      <div className="mx-auto max-w-6xl">
        <SectionLabel
          number={content.sectionNumber}
          title={content.sectionTitle}
        />
        <h2 className="mb-14 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
          {content.intro}
        </h2>

        <div className="space-y-3">
          {projectRows.map((row, rowIndex) => {
            const activeRowItem =
              row.find(
                (item): item is InspectableProjectItem =>
                  item.number === activeItemNumber && hasProjectDetails(item)
              ) ?? null;

            return (
              <div
                key={row.map((item) => item.number).join("-")}
                className="space-y-3"
                data-project-row={rowIndex}
              >
                <div className="grid gap-3 xl:grid-cols-2">
                  {row.map((item, itemIndex) => (
                    <ProjectCard
                      key={item.number}
                      item={item}
                      index={rowIndex * 2 + itemIndex}
                      content={content}
                      isActive={activeItemNumber === item.number}
                      onToggle={() => toggleItem(item.number)}
                      showInlineDossier={
                        !isDesktop && activeItemNumber === item.number
                      }
                    />
                  ))}
                </div>

                <AnimatePresence initial={false} mode="wait">
                  {isDesktop && activeRowItem ? (
                    <ProjectDossier
                      key={activeRowItem.number}
                      item={activeRowItem}
                      content={content}
                      variant="shared"
                    />
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  item: ProjectItem;
  index: number;
  content: PortfolioContent["projects"];
  isActive: boolean;
  onToggle?: () => void;
  showInlineDossier?: boolean;
}

function ProjectCard({
  item,
  index,
  content,
  isActive,
  onToggle,
  showInlineDossier = false,
}: ProjectCardProps) {
  const isInspectable = hasProjectDetails(item);
  const previewEntries = isInspectable ? getPreviewEntries(item, content) : [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.05 }}
      className={[
        "surface-card project-card flex h-full flex-col",
        isInspectable ? "project-card-inspectable" : "",
        isActive ? "project-card-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-project-number={item.number}
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <span className="mono-label text-accent">{item.number}</span>

        <div className="text-right">
          <p className="mono-label text-muted-foreground">{item.company}</p>
          {item.contextLabel ? (
            <p className="mt-2 text-sm text-faint">{item.contextLabel}</p>
          ) : null}
          {isInspectable ? (
            <p
              className={[
                "mono-label mt-3",
                isActive ? "text-accent" : "text-faint",
              ].join(" ")}
            >
              {isActive
                ? content.inspectionActiveLabel
                : content.inspectionEyebrow}
            </p>
          ) : null}
        </div>
      </div>

      <h3 className="mb-4 text-2xl font-semibold tracking-[-0.03em] text-foreground">
        {item.name}
      </h3>

      <div className="mb-5 flex flex-wrap gap-2">
        {item.themes.map((theme) => (
          <span key={theme} className="theme-chip">
            {theme}
          </span>
        ))}
      </div>

      <p className="flex-1 text-base leading-8 text-muted-foreground">
        {item.description}
      </p>

      <div className="section-divider mt-7" />

      <div className="mt-6 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="accent-chip">
            {tag}
          </span>
        ))}
      </div>

      {isInspectable ? (
        <>
          <div className="project-preview-grid mt-6">
            {previewEntries.map((entry) => (
              <div key={entry.label} className="project-preview-cell">
                <p className="mono-label text-faint">{entry.label}</p>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {entry.value}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isActive}
            className="project-inspection-trigger mt-6 text-left"
          >
            <div>
              <span className="mono-label text-foreground">
                {isActive ? content.collapseLabel : content.expandLabel}
              </span>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isActive
                  ? content.inspectionActiveLabel
                  : content.inspectionHint}
              </p>
            </div>
            <span className="project-trigger-indicator" aria-hidden="true">
              {isActive ? "-" : "+"}
            </span>
          </button>

          <div
            className={[
              "project-card-rail mt-6",
              isActive ? "project-card-rail-active" : "",
            ].join(" ")}
            aria-hidden="true"
          />
        </>
      ) : null}

      <AnimatePresence initial={false}>
        {showInlineDossier && isInspectable ? (
          <ProjectDossier item={item} content={content} variant="inline" />
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}

interface ProjectDossierProps {
  item: InspectableProjectItem;
  content: PortfolioContent["projects"];
  variant: "shared" | "inline";
}

function ProjectDossier({ item, content, variant }: ProjectDossierProps) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={[
        "project-dossier overflow-hidden",
        variant === "shared" ? "mt-3" : "mt-8",
      ].join(" ")}
      aria-label={`${item.name} ${content.inspectionEyebrow}`}
    >
      <div className="project-dossier-header">
        <div className="min-w-0 flex-1">
          <p className="mono-label text-accent">{content.inspectionEyebrow}</p>

          <div className="mt-4 flex items-start gap-4">
            <span className="project-dossier-number mono-label text-accent">
              {item.number}
            </span>

            <div className="min-w-0">
              <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                {item.name}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {item.contextLabel ?? item.company}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start justify-end gap-2">
          {item.details.badgeLabel ? (
            <span className="project-dossier-chip">{item.details.badgeLabel}</span>
          ) : null}
          <span className="project-dossier-chip project-dossier-chip-muted">
            {item.company}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {item.themes.map((theme) => (
          <span key={theme} className="theme-chip">
            {theme}
          </span>
        ))}
      </div>

      <div className="project-dossier-grid mt-8">
        <section className="project-dossier-block">
          <p className="mono-label text-accent">{content.summaryTitle}</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {item.details.summary}
          </p>
        </section>

        <section className="project-dossier-block">
          <p className="mono-label text-accent">{content.footprintTitle}</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            {item.details.footprint.map((entry) => (
              <li key={entry} className="project-dossier-list-item">
                <span className="project-dossier-dot" aria-hidden="true" />
                <span>{entry}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="project-dossier-block project-dossier-block-wide">
          <p className="mono-label text-accent">{content.responsibilitiesTitle}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {item.details.responsibilities.map((responsibility, index) => (
              <div key={responsibility} className="project-dossier-note">
                <span className="mono-label text-accent">
                  {item.number}.{String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {responsibility}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="project-dossier-footer">
        {item.details.note ? (
          <p className="max-w-3xl text-xs leading-6 text-faint">
            {item.details.note}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="accent-chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function hasProjectDetails(item: ProjectItem): item is InspectableProjectItem {
  return Boolean(item.details);
}

function createProjectRows(items: readonly ProjectItem[]) {
  const rows: ProjectItem[][] = [];

  items.forEach((item, index) => {
    const rowIndex = Math.floor(index / 2);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push(item);
  });

  return rows;
}

function getPreviewEntries(
  item: InspectableProjectItem,
  content: PortfolioContent["projects"]
) {
  return [
    {
      label: content.previewLabels.context,
      value: item.contextLabel ?? item.company,
    },
    {
      label: content.previewLabels.focus,
      value: item.themes[0] ?? item.company,
    },
    {
      label: content.previewLabels.stack,
      value: item.tags.slice(0, 2).join(" · "),
    },
  ];
}
