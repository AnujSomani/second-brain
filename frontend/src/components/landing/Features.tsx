import { SectionHeader } from "./SectionHeader";

export function Features() {
  const features = [
    {
      title: "AI-Powered Organization",
      description: "Automatically categorize and tag your links. AI understands context and creates meaningful connections between your saved websites.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Smart Search",
      description: "Search naturally with questions or keywords. Our AI understands intent and finds exactly what you need across all your saved links.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      title: "Share Brain",
      description: "Share your curated collection of links with others. Perfect for teams, research groups, or collaborating on projects.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      title: "Fast Capture",
      description: "Save links instantly with browser extension. Nothing stands between you and your next great discovery.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      title: "Cross-Device Sync",
      description: "Access your second brain from anywhere. Seamless sync across web, desktop, and mobile with real-time updates.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Privacy First",
      description: "Your data is encrypted end-to-end. You own your knowledge—we never sell or share your information with third parties.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Powerful features"
          subtitle="Everything you need to build and grow your second brain"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-3xl bg-panel/90 backdrop-blur-md border border-line hover:border-purple-300 dark:hover:border-purple-400/60 shadow-[0_10px_30px_rgba(147,51,234,0.04)] dark:shadow-purple-950/20 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 mb-5 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-xs">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-ink mb-3">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
