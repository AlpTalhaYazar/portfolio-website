"use client";

interface SectionLabelProps {
  number: string;
  title: string;
}

export function SectionLabel({ number, title }: SectionLabelProps) {
  return (
    <div className="mb-16 flex items-center gap-4">
      <span className="mono-label text-accent">{number}</span>
      <div className="h-px w-10 bg-border" />
      <span className="mono-label text-muted-foreground">{title}</span>
    </div>
  );
}
