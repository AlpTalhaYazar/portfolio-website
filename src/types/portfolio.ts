export type PortfolioLocale = "en" | "tr" | "es";

export interface PortfolioNavItem {
  readonly label: string;
  readonly href: string;
}

export interface PortfolioHeroContent {
  readonly eyebrow: string;
  readonly availability: string;
  readonly headline: string;
  readonly supportingText: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly techTags: readonly string[];
}

export interface PortfolioAboutContent {
  readonly sectionNumber: string;
  readonly sectionTitle: string;
  readonly lead: string;
  readonly paragraphs: readonly string[];
  readonly statusPill: string;
}

export interface PortfolioExperienceItem {
  readonly number: string;
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly location: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface PortfolioProjectItem {
  readonly number: string;
  readonly name: string;
  readonly company: string;
  readonly contextLabel?: string;
  readonly description: string;
  readonly themes: readonly string[];
  readonly tags: readonly string[];
  readonly details?: {
    readonly badgeLabel?: string;
    readonly note?: string;
    readonly summary: string;
    readonly responsibilities: readonly string[];
    readonly footprint: readonly string[];
  };
}

export interface PortfolioCapabilityGroup {
  readonly category: string;
  readonly items: readonly string[];
}

export interface PortfolioContactFormCopy {
  readonly nameLabel: string;
  readonly emailLabel: string;
  readonly subjectLabel: string;
  readonly messageLabel: string;
  readonly submitLabel: string;
  readonly submittingLabel: string;
  readonly placeholders: {
    readonly name: string;
    readonly email: string;
    readonly subject: string;
    readonly message: string;
  };
  readonly validation: {
    readonly nameRequired: string;
    readonly emailInvalid: string;
    readonly subjectRequired: string;
    readonly messageRequired: string;
    readonly messageMinLength: string;
  };
  readonly success: string;
  readonly securityLoading: string;
  readonly secured: string;
  readonly blocked: string;
}

export interface PortfolioContactContent {
  readonly sectionNumber: string;
  readonly sectionTitle: string;
  readonly headline: string;
  readonly intro: string;
  readonly body: string;
  readonly form: PortfolioContactFormCopy;
}

export interface PortfolioFooterContent {
  readonly strapline: string;
  readonly copyright: string;
}

export interface PortfolioNotFoundContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
}

export interface PortfolioContent {
  readonly locale: PortfolioLocale;
  readonly metadata: {
    readonly title: string;
    readonly description: string;
  };
  readonly nav: {
    readonly homeLabel: string;
    readonly items: readonly PortfolioNavItem[];
    readonly languageLabel: string;
    readonly letsTalkLabel: string;
    readonly closeMenuLabel: string;
    readonly openMenuLabel: string;
  };
  readonly hero: PortfolioHeroContent;
  readonly about: PortfolioAboutContent;
  readonly experience: {
    readonly sectionNumber: string;
    readonly sectionTitle: string;
    readonly intro: string;
    readonly items: readonly PortfolioExperienceItem[];
  };
  readonly projects: {
    readonly sectionNumber: string;
    readonly sectionTitle: string;
    readonly intro: string;
    readonly expandLabel: string;
    readonly collapseLabel: string;
    readonly inspectionEyebrow: string;
    readonly inspectionHint: string;
    readonly inspectionActiveLabel: string;
    readonly previewLabels: {
      readonly context: string;
      readonly focus: string;
      readonly stack: string;
    };
    readonly summaryTitle: string;
    readonly responsibilitiesTitle: string;
    readonly footprintTitle: string;
    readonly items: readonly PortfolioProjectItem[];
  };
  readonly capabilities: {
    readonly sectionNumber: string;
    readonly sectionTitle: string;
    readonly groups: readonly PortfolioCapabilityGroup[];
    readonly callout: string;
    readonly statLabel: string;
  };
  readonly contact: PortfolioContactContent;
  readonly footer: PortfolioFooterContent;
  readonly notFound: PortfolioNotFoundContent;
}
