import { SectionHeader } from "./SectionHeader";

export function UseCases() {
  const useCases = [
    {
      title: "Students",
      description: "Organize research papers, lecture notes, and study materials. Find connections between topics and never lose important references.",
      icon: "📚"
    },
    {
      title: "Developers",
      description: "Save code snippets, documentation, and solutions. Quickly find that fix you used months ago with smart search.",
      icon: "💻"
    },
    {
      title: "Creators",
      description: "Capture inspiration, reference images, and content ideas. Build a creative library that fuels your next project.",
      icon: "✨"
    },
    {
      title: "Professionals",
      description: "Keep meeting notes, project docs, and industry insights organized. Make informed decisions with all your knowledge at hand.",
      icon: "💼"
    }
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Built for everyone"
          subtitle="Whether you're studying, building, creating, or leading—Brainly adapts to your workflow"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-panel/90 backdrop-blur-md border border-line hover:border-purple-300 dark:hover:border-purple-400/60 shadow-[0_10px_30px_rgba(147,51,234,0.04)] dark:shadow-purple-950/20 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{useCase.icon}</div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                {useCase.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}