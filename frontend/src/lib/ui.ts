export const ui = {
  page: "min-h-screen bg-page text-ink transition-colors duration-300",
  header:
    "sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/85 backdrop-blur-xl px-6 py-4",
  panel: "rounded-2xl border border-line bg-panel",
  card: "rounded-3xl border border-line bg-panel/90 backdrop-blur-md",
  inset: "rounded-xl border border-line bg-inset",
  field:
    "w-full rounded-xl border border-line bg-inset px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-muted/70 hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:hover:border-purple-400/60 dark:focus:border-purple-400 dark:focus:ring-purple-400/25",
  fieldError: "border-rose-500 focus:border-rose-500 focus:ring-rose-400/20 dark:border-rose-400",
  label: "text-sm font-semibold text-ink",
  muted: "text-muted",
  heading: "font-bold text-ink",
  pill:
    "rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-300",
  iconBtn:
    "rounded-xl border border-line p-2.5 text-muted hover:bg-inset hover:text-ink transition-colors cursor-pointer",
  ghost:
    "rounded-xl border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-inset hover:border-purple-300 dark:text-purple-200 dark:hover:border-purple-400/50 dark:hover:bg-purple-500/20 transition-colors cursor-pointer",
  navIdle:
    "text-slate-600 hover:bg-inset hover:text-purple-700 dark:text-purple-200/70 dark:hover:text-white dark:hover:bg-purple-500/15",
  navActive: "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-600/25",
  close:
    "rounded-lg p-1.5 text-muted hover:bg-inset hover:text-ink transition-colors cursor-pointer",
  authLink: "font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 transition-colors cursor-pointer",
  divider: "h-px flex-1 bg-line",
} as const;