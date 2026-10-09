import { SectionHeader } from "./SectionHeader";

export function HowItWorks() {
  const steps = [
    {
      title: "Save Links",
      description: "Save websites and links from anywhere with one click. Our browser extension makes it effortless to build your collection."
    },
    {
      title: "AI Organizes",
      description: "AI automatically categorizes and tags your links. It connects related websites and builds a knowledge graph that grows with you."
    },
    {
      title: "Find Instantly",
      description: "Search naturally and find exactly what you need. Ask questions and get intelligent answers based on your saved websites."
    }
  ];

  return (
    <section id="how-it-works" className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="How it works"
          subtitle="Build your second brain in three effortless cognitive steps"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative p-8 rounded-3xl bg-panel/90 backdrop-blur-md border border-line shadow-[0_10px_30px_rgba(147,51,234,0.04)] dark:shadow-purple-950/20 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-400/60 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-tr from-purple-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">
                {step.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm sm:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}