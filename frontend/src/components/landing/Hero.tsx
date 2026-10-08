import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import brain from "../../assets/brain.jpg";

export function Hero() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    "AI-powered organization",
    "Smart search across links",
    "Share your brain with others"
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-transparent overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Value Proposition */}

          <div className="lg:col-span-6 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5 leading-[1.12]">
              <span className="text-ink block">Remember everything.</span>
              <span className="text-purple-600 dark:text-purple-400 block sm:inline">
                Find anything.
              </span>
            </h1>
            <br />

            <p className="text-lg sm:text-xl text-muted mb-6 sm:mb-8 max-w-xl leading-relaxed">
              Save your links in one private second brain. Use AI to retrieve exactly what you need, when you need it.
            </p>

            <ul className="space-y-3.5 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-ink/90 font-medium">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <br />

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="primary" title="Get Started" fullWidth />
              </Link>
              <button
                onClick={scrollToDemo}
                className="w-full sm:w-auto cursor-pointer"
              >
                <Button variant="secondary" title="Watch Demo" fullWidth />
              </button>
            </div>
            <p className="mt-5 text-sm text-muted flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Free forever • No credit card required • Private & secure
            </p>
          </div>

          {/* Right Column: Seamless 3D Brain with Orbiting Connected URL-Based Cards */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Ambient Violet Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-purple-300/35 dark:bg-purple-900/25 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Orbiting Canvas Container */}
            <div className="relative w-full max-w-[560px] h-[460px] sm:h-[520px] flex items-center justify-center select-none">
              {/* Orbital 3D SVG Rings */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
                viewBox="0 0 560 520"
                fill="none"
              >
                {/* Outer Orbit */}
                <ellipse
                  cx="280"
                  cy="260"
                  rx="220"
                  ry="170"
                  transform="rotate(-15 280 260)"
                  stroke="#c084fc"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  className="opacity-45"
                />
                {/* Secondary Tilted Orbit */}
                <ellipse
                  cx="280"
                  cy="260"
                  rx="180"
                  ry="210"
                  transform="rotate(35 280 260)"
                  stroke="#d8b4fe"
                  strokeWidth="1"
                  className="opacity-40"
                />

                {/* Connection lines to floating cards with nodes */}
                <path d="M 280 240 Q 200 160 145 85" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="145" cy="85" r="3" fill="#a855f7" />

                <path d="M 240 260 Q 170 250 115 230" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="115" cy="230" r="3" fill="#a855f7" />

                <path d="M 250 300 Q 180 360 140 420" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="140" cy="420" r="3" fill="#ef4444" />

                <path d="M 310 230 Q 370 150 425 80" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="425" cy="80" r="3" fill="#ef4444" />

                <path d="M 320 260 Q 400 260 445 240" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="445" cy="240" r="3" fill="#9333ea" />

                <path d="M 310 300 Q 380 330 430 370" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="430" cy="370" r="3" fill="#ef4444" />

                <path d="M 280 320 Q 280 400 300 465" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                <circle cx="300" cy="465" r="3" fill="#9333ea" />
              </svg>

              {/* Central Isolated Brain (No square borders/outlines) */}
              <div className="relative z-10 w-[270px] sm:w-[320px] lg:w-[340px] flex items-center justify-center pointer-events-none">
                <div className="absolute -bottom-2 w-[180px] sm:w-[220px] h-[28px] bg-purple-900/15 rounded-full blur-lg" />
                <img
                  src={brain}
                  alt="Brainly AI Second Brain"
                  className="brain-seamless-mask brain-float w-full h-auto drop-shadow-sm select-none"
                  style={{
                    filter: "contrast(1.05) saturate(1.08)"
                  }}
                />
              </div>

              {/* ── Supported Link/URL Floating Cards ── */}

              {/* Card 1: Top-Left: Document URL */}
              <div className="absolute top-[8%] left-[2%] sm:left-[6%] z-20 animate-float-slow">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">Product Spec.pdf</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">drive.google.com • Document</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Mid-Left: Tweet URL */}
              <div className="absolute top-[42%] left-[0%] sm:-left-[2%] z-20 animate-float-reverse">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-semibold">
                    🐦
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">AI Architecture</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">x.com • Tweet</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Bottom-Left: Document/PDF URL */}
              <div className="absolute bottom-[10%] left-[4%] sm:left-[8%] z-20 animate-float-slow">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">Research Paper.pdf</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">arxiv.org • Document</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Top-Right: Video URL */}
              <div className="absolute top-[6%] right-[2%] sm:right-[6%] z-20 animate-float-slow">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs">
                    ▶
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">Building AI Agents</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">youtube.com • Video</p>
                  </div>
                </div>
              </div>

              {/* Card 5: Mid-Right: Article URL */}
              <div className="absolute top-[40%] right-[0%] sm:-right-[4%] z-20 animate-float-reverse">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs">
                    🔖
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">The Future of AI</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">techcrunch.com • Article</p>
                  </div>
                </div>
              </div>

              {/* Card 6: Lower-Right: Video URL */}
              <div className="absolute bottom-[20%] right-[2%] sm:right-[4%] z-20 animate-float-slow">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs">
                    ▶
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">System Design 101</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">youtube.com • Video</p>
                  </div>
                </div>
              </div>

              {/* Card 7: Bottom-Center: Article URL */}
              <div className="absolute -bottom-[2%] left-[45%] -translate-x-1/2 z-20 animate-float-reverse">
                <div className="flex items-center gap-2.5 px-3 py-2 bg-panel/95 backdrop-blur-md rounded-xl border border-line shadow-[0_6px_20px_rgba(147,51,234,0.08)] dark:shadow-purple-950/40 hover:shadow-md transition-transform hover:scale-105 cursor-default">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs">
                    🔗
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">React 19 Deep Dive</p>
                    <p className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">react.dev • Article</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
