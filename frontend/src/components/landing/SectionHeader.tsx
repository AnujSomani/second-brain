interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
        {title}
      </h2>
      <p className="text-lg text-muted max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
