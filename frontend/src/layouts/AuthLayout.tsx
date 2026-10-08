import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { BrainPanel } from "../components/auth/BrainPanel";
import { ParticlesBackground } from "../components/auth/ParticlesBackground";
import brain from "../assets/brain.jpg";

export function AuthLayout() {
  // Force light mode for auth pages
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page text-ink transition-colors duration-300 flex items-center justify-center">
      {/* Seamless ambient background glows bridging the left and right sides */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Central luminous connector glow between brain and form — wider & softer to eliminate the sharp split */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] bg-gradient-to-r from-purple-400/30 via-violet-300/25 to-purple-400/25 rounded-full blur-[120px] opacity-90" />
        {/* Upper ambient glow */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-3xl" />
        {/* Lower ambient glow */}
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-3xl" />
      </div>

      {/* Interactive, vibrant neural particles spanning full canvas */}
      <ParticlesBackground />

      {/* Top action bar: Brainly logo only */}
      <div className="absolute top-5 left-5 z-20 flex items-center pointer-events-none">
        <Link
          to="/"
          className="flex items-center gap-2.5 pointer-events-auto rounded-full p-1 pr-3 hover:bg-surface/60 transition-colors"
          title="Return to home"
        >
          <div className="size-9 rounded-full overflow-hidden ring-2 ring-purple-300 shadow-sm">
            <img src={brain} alt="Brainly" className="size-full object-cover" />
          </div>
          <span className="text-base font-bold text-ink tracking-tight">Brainly</span>
        </Link>
      </div>

      {/* Main unified layout: cohesive two-column flow with no hard visual split */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-0 min-h-screen grid lg:grid-cols-12 items-center gap-4 lg:gap-6">
        {/* Left Column: Floating Brain + Value Prop */}
        <div className="hidden lg:flex lg:col-span-6 justify-center items-center">
          <BrainPanel />
        </div>

        {/* Right Column: Centered Auth Card */}
        <div className="lg:col-span-6 flex items-center justify-center w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
