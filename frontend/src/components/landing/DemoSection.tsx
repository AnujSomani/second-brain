import { useState } from "react";

interface SavedItem {
  id: string;
  type: "article" | "video" | "thread" | "note";
  title: string;
  source: string;
  meta: string;
  icon: string;
  tags: string[];
  summary: string;
}

export function DemoSection() {
  const [activeTab, setActiveTab] = useState<"synthesis" | "ask" | "graph">("synthesis");
  const [selectedItem, setSelectedItem] = useState<string>("item-1");

  const savedItems: SavedItem[] = [
    {
      id: "item-1",
      type: "article",
      title: "Distributed Systems & Vector Memory",
      source: "https://engineering.blog/vectors • Article",
      meta: "Saved 2h ago",
      icon: "📰",
      tags: ["Distributed", "VectorDB", "AI"],
      summary: "Explains hierarchical memory structures and sub-millisecond retrieval across embedded knowledge spaces."
    },
    {
      id: "item-2",
      type: "video",
      title: "Building Cognitive AI Agents with Memory",
      source: "https://youtube.com/watch?v=agents • Video",
      meta: "Saved yesterday",
      icon: "🎥",
      tags: ["CognitiveAI", "Memory", "Architecture"],
      summary: "Deep dive into why dual-layer memory graphs surpass standard LLM context windows."
    },
    {
      id: "item-3",
      type: "thread",
      title: "Design Tokens & Modern Architecture",
      source: "https://x.com/design_lead/status/821 • Tweet",
      meta: "Saved 3d ago",
      icon: "🐦",
      tags: ["UI/UX", "DesignTokens", "Frontend"],
      summary: "Principles for tactile depth, soft lighting, and high-readability cognitive dashboards."
    },
    {
      id: "item-4",
      type: "note",
      title: "Vector Caching & Indexing.pdf",
      source: "https://arxiv.org/pdf/2403.05530.pdf • Document",
      meta: "Saved 4d ago",
      icon: "📄",
      tags: ["Caching", "Document", "Performance"],
      summary: "Benchmark results showing 68% latency reduction when paired with distributed embeddings."
    }
  ];

  return (
    <section id="demo" className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Experience how Brainly connects disparate ideas, surfaces hidden associations, and synthesizes answers like human cognition.
          </p>
        </div>

        {/* Cognitive Dashboard Container */}
        <div className="max-w-6xl mx-auto bg-panel/90 backdrop-blur-xl rounded-3xl border border-line shadow-[0_20px_60px_-15px_rgba(147,51,234,0.07)] dark:shadow-purple-950/25 p-5 sm:p-8 lg:p-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Multi-Source Knowledge Inputs (Active Memories) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-sm font-semibold text-ink">Active Knowledge Stream</span>
                </div>
                <span className="text-xs text-purple-700 dark:text-purple-300 font-medium bg-purple-50 dark:bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-700/50">
                  4 memories indexed
                </span>
              </div>

              <div className="space-y-3">
                {savedItems.map((item) => {
                  const isSelected = selectedItem === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item.id)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/80 dark:bg-purple-900/40 border-purple-400 dark:border-purple-500 shadow-xs ring-2 ring-purple-400/20"
                          : "bg-surface dark:bg-panel hover:bg-purple-50/40 dark:hover:bg-inset border-line hover:border-purple-300 dark:hover:border-purple-500/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-base flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-ink truncate">
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-muted whitespace-nowrap">
                              {item.meta}
                            </span>
                          </div>
                          <p className="text-xs text-muted truncate mb-2">
                            {item.source}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-inset border border-line text-purple-700 dark:text-purple-300"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-muted text-center pt-1">
                Tip: Click any item to inspect how your brain indexes context
              </p>
            </div>

            {/* Middle Column: Neural Synapse Bridge */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center self-stretch py-8 select-none">
              <div className="flex flex-col items-center gap-3">
                <div className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-700/60 text-[11px] font-semibold text-purple-700 dark:text-purple-300 shadow-xs">
                  Neural Bridge
                </div>

                {/* Subtle Neural Synaptic Stream Visualizer */}
                <div className="relative w-16 h-48 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 64 192" fill="none">
                    <path
                      d="M 4 20 C 40 40 24 80 60 96"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="animate-synapse opacity-60"
                    />
                    <path
                      d="M 4 96 C 32 96 32 96 60 96"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="opacity-70"
                    />
                    <path
                      d="M 4 172 C 40 152 24 112 60 96"
                      stroke="#c084fc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="animate-synapse opacity-60"
                    />
                    <circle cx="32" cy="96" r="6" fill="#9333ea" className="animate-pulse" />
                    <circle cx="32" cy="96" r="12" fill="#c084fc" opacity="0.3" className="animate-ping" />
                  </svg>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-medium text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-700/50">
                    98.7% match
                  </span>
                  <p className="text-[10px] text-muted mt-1">Cross-referencing</p>
                </div>
              </div>
            </div>

            {/* Right Column: Cognitive Synthesis & Recall */}
            <div className="lg:col-span-5 space-y-4">
              {/* Cognitive Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-inset rounded-xl border border-line">
                <button
                  onClick={() => setActiveTab("synthesis")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "synthesis"
                      ? "bg-panel text-purple-700 dark:text-purple-300 shadow-xs border border-line"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  ⚡ Synthesis
                </button>
                <button
                  onClick={() => setActiveTab("ask")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "ask"
                      ? "bg-panel text-purple-700 dark:text-purple-300 shadow-xs border border-line"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  💬 Ask Brain
                </button>
                <button
                  onClick={() => setActiveTab("graph")}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeTab === "graph"
                      ? "bg-panel text-purple-700 dark:text-purple-300 shadow-xs border border-line"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  🕸️ Synapse Graph
                </button>
              </div>

              {/* Mode 1: Synthesis View */}
              {activeTab === "synthesis" && (
                <div className="p-5 rounded-2xl bg-panel border border-line shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <span className="text-xs font-bold text-ink uppercase tracking-wider">
                        Cognitive Synthesis
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ✓ Instant Recall
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-ink mb-1.5">
                      Synthesized Knowledge Connection
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Brainly automatically discovered a shared architectural pattern across your saved technical paper, keynote, and personal notes: <strong className="text-purple-700 dark:text-purple-300 font-semibold">Tiered vector embeddings with Redis caching</strong> solves both cold-start recall latency and token cost overruns.
                    </p>
                  </div>

                  {/* Knowledge Nodes Cluster */}
                  <div className="p-3 bg-inset rounded-xl border border-line space-y-2">
                    <span className="text-[11px] font-semibold text-ink block">
                      Auto-Clustered Concept Group:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs font-medium border border-purple-200 dark:border-purple-700/50">
                        ⚡ High-Throughput Memory
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200/60 dark:border-purple-700/40">
                        🧠 Dual-Layer Retrieval
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-medium border border-purple-200/60 dark:border-purple-700/40">
                        💾 68% Latency Win
                      </span>
                    </div>
                  </div>

                  {/* Smart Suggested Action */}
                  <div className="flex items-center justify-between gap-3 p-3 bg-inset rounded-xl border border-line">
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600 dark:text-purple-400 text-base">✨</span>
                      <p className="text-xs text-ink font-medium">
                        Suggested Collection: <span className="font-semibold text-purple-700 dark:text-purple-300">"Next-Gen AI Stack"</span>
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                      Group 4 Links
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Ask Brain View */}
              {activeTab === "ask" && (
                <div className="p-5 rounded-2xl bg-panel border border-line shadow-xs space-y-4">
                  {/* Natural Language Prompt */}
                  <div className="flex items-start gap-2.5 p-3 bg-inset rounded-xl border border-line">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-semibold text-purple-700 dark:text-purple-300 flex-shrink-0">
                      You
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-ink">
                        "What did my saved articles say about optimizing vector retrieval speed?"
                      </p>
                    </div>
                  </div>

                  {/* AI Synthesized Response with Citations */}
                  <div className="flex items-start gap-2.5 p-3.5 bg-inset rounded-xl border border-line">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      AI
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-ink leading-relaxed">
                        According to your saved paper and lecture notes:
                      </p>
                      <ul className="text-xs text-muted space-y-1 list-disc pl-4 leading-relaxed">
                        <li>Implement two-tier indexing (fast rough search + exact HNSW re-ranking).</li>
                        <li>Cache top 20% vector queries in Redis for sub-5ms response.</li>
                      </ul>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-muted font-medium">Citations:</span>
                        <span className="text-[10px] px-2 py-0.5 bg-panel rounded border border-line text-purple-700 dark:text-purple-300 font-medium">
                          📄 Distributed Systems [p. 4]
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-panel rounded border border-line text-purple-700 dark:text-purple-300 font-medium">
                          🎥 Video [08:14]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Synapse Graph View */}
              {activeTab === "graph" && (
                <div className="p-5 rounded-2xl bg-panel border border-line shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Neural Knowledge Graph</span>
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">4 nodes • 6 synapses</span>
                  </div>

                  {/* Interactive SVG Knowledge Network */}
                  <div className="h-52 w-full bg-inset rounded-xl border border-line flex items-center justify-center relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 320 200">
                      {/* Synapse Link Lines */}
                      <line x1="80" y1="60" x2="160" y2="100" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="240" y1="60" x2="160" y2="100" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
                      <line x1="100" y1="150" x2="160" y2="100" stroke="#a855f7" strokeWidth="2" />
                      <line x1="220" y1="150" x2="160" y2="100" stroke="#a855f7" strokeWidth="2" />
                      <line x1="80" y1="60" x2="100" y2="150" stroke="#c084fc" strokeWidth="1" opacity="0.5" />
                      <line x1="240" y1="60" x2="220" y2="150" stroke="#c084fc" strokeWidth="1" opacity="0.5" />

                      {/* Central Second Brain Concept Node */}
                      <circle cx="160" cy="100" r="22" fill="#9333ea" />
                      <text x="160" y="104" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                        Brainly
                      </text>

                      {/* Surrounding Memory Nodes */}
                      <circle cx="80" cy="60" r="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
                      <text x="80" y="63" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="bold">
                        Vector
                      </text>

                      <circle cx="240" cy="60" r="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2" />
                      <text x="240" y="63" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="bold">
                        Agent
                      </text>

                      <circle cx="100" cy="150" r="14" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
                      <text x="100" y="153" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="bold">
                        Cache
                      </text>

                      <circle cx="220" cy="150" r="14" fill="#ffffff" stroke="#a855f7" strokeWidth="2" />
                      <text x="220" y="153" textAnchor="middle" fill="#6b21a8" fontSize="8" fontWeight="bold">
                        UI/UX
                      </text>
                    </svg>
                  </div>
                  <p className="text-[11px] text-muted text-center">
                    Visualizing how Brainly autonomously connects concepts across your saved links.
                  </p>
                </div>
              )}

              {/* Status footer pill */}
              <div className="flex items-center justify-between px-3 py-2 bg-inset rounded-xl border border-line text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Privacy: End-to-end encrypted
                </span>
                <span className="text-purple-700 dark:text-purple-300 font-semibold">Semantic Graph Ready</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}