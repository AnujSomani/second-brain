import brain from "../../assets/brain.jpg";

export function BrainPanel() {
  return (
    <div className="relative hidden h-full flex-col items-center justify-center overflow-hidden px-8 lg:flex select-none">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute h-[32rem] w-[32rem] rounded-full bg-purple-500/15 dark:bg-purple-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute h-[20rem] w-[20rem] rounded-full bg-violet-400/20 dark:bg-violet-500/25 blur-[70px] animate-pulse" />

      {/* Main floating brain cortex */}
      <div className="brain-float relative z-10 w-full max-w-lg">
        <div className="relative flex items-center justify-center">
          <img
            src={brain}
            alt="Neural brain"
            className="brain-auth-mask w-full select-none drop-shadow-[0_0_50px_rgba(168,85,247,0.35)]"
            style={{
              filter: "contrast(1.12) saturate(1.18) brightness(0.98)",
            }}
            draggable={false}
          />
        </div>

        {/* Feature showcase below brain */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Remember everything.{" "}
            <span className="text-purple-600 dark:text-purple-300">Find anything.</span>
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-purple-200/80 max-w-sm mx-auto leading-relaxed">
            Save articles, tweets, documents, and videos. Let AI semantically connect your ideas.
          </p>
        </div>
      </div>
    </div>
  );
}
