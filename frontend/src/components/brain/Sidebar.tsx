import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";
import type { SidebarFilter } from "../../types/brain";
import brain from "../../assets/brain.jpg";
import {
  GridIcon,
  ArticleIcon,
  DocumentIcon,
  TweetIcon,
  VideoIcon,
  TagIcon,
  SparklesIcon,
  UserIcon,
  CollapseIcon,
} from "../../icons";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeFilter?: SidebarFilter;
  onFilterChange?: (filter: SidebarFilter) => void;
}

const CATEGORIES: Array<{
  key: SidebarFilter;
  label: string;
  icon: ReactNode;
}> = [
  {
    key: "all",
    label: "All Notes",
    icon: <GridIcon className="size-5" />,
  },
  {
    key: "article",
    label: "Articles",
    icon: <ArticleIcon className="size-5" />,
  },
  {
    key: "document",
    label: "Documents",
    icon: <DocumentIcon className="size-5" />,
  },
  {
    key: "tweet",
    label: "Tweets",
    icon: <TweetIcon className="size-5" />,
  },
  {
    key: "video",
    label: "Videos",
    icon: <VideoIcon className="size-5" />,
  },
  {
    key: "tags",
    label: "Tags",
    icon: <TagIcon className="size-5" />,
  },
];

export function Sidebar({
  isOpen,
  onToggle,
  activeFilter,
  onFilterChange,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatActive = location.pathname === "/chat";
  const isBrainActive = location.pathname === "/brain";
  const isProfileActive = location.pathname === "/profile";

  const handleCategoryClick = (key: SidebarFilter) => {
    if (onFilterChange && isBrainActive) {
      onFilterChange(key);
    } else {
      navigate("/brain");
      if (onFilterChange) onFilterChange(key);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-line bg-surface transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-0 lg:w-16",
          !isOpen && "overflow-hidden lg:overflow-visible"
        )}
      >
        {/* Header with Brain Logo Image */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-4 min-h-[65px]">
          <Link to="/brain" className="flex items-center gap-3 shrink-0">
            <div className="relative size-9 rounded-full overflow-hidden ring-2 ring-purple-300 dark:ring-purple-500/40 shadow-sm shrink-0">
              <img src={brain} alt="Brainly Logo" className="size-full object-cover" />
            </div>
            {isOpen && (
              <span className="whitespace-nowrap text-lg font-bold text-ink tracking-tight">
                Brainly
              </span>
            )}
          </Link>
        </div>

        {/* Categories Nav items + Ask AI */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const isActive = isBrainActive && activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryClick(cat.key)}
                  title={cat.label}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
                    isActive ? ui.navActive : ui.navIdle,
                    !isOpen && "lg:justify-center lg:px-0"
                  )}
                >
                  <span className="shrink-0">{cat.icon}</span>
                  {isOpen && <span className="truncate">{cat.label}</span>}
                </button>
              );
            })}

            {/* Dedicated Ask AI Nav Item */}
            <div className="pt-2 mt-2 border-t border-line">
              <Link
                to="/chat"
                title="Ask AI"
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
                  isChatActive ? ui.navActive : ui.navIdle,
                  !isOpen && "lg:justify-center lg:px-0"
                )}
              >
                <span className="shrink-0">
                  <SparklesIcon className="size-5 text-amber-500 dark:text-amber-400" />
                </span>
                {isOpen && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">Ask AI</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-wide",
                        isChatActive ? "bg-white/20 text-white" : ui.pill,
                      )}
                    >
                      AI
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </nav>
        </div>

        {/* My Profile Link (Requirement 3) */}
        <div className="border-t border-line px-2 py-2">
          <Link
            to="/profile"
            title="My Profile"
            className={cn(
              "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer",
              isProfileActive ? ui.navActive : ui.navIdle,
              !isOpen && "lg:justify-center lg:px-0"
            )}
          >
            <div className={cn(
              "size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ring-1",
              isProfileActive
                ? "bg-white/20 text-white ring-white/30"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 ring-purple-200 dark:ring-purple-800/40"
            )}>
              <UserIcon className="size-4.5" />
            </div>
            {isOpen && (
              <div className="flex flex-col text-left truncate">
                <span className={cn(
                  "truncate text-xs font-bold leading-tight",
                  isProfileActive ? "text-white" : "text-ink"
                )}>
                  My Profile
                </span>
                <span className={cn(
                  "text-[10px] font-normal truncate",
                  isProfileActive ? "text-white/80" : "text-muted"
                )}>
                  Account & Password
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar Toggle Button Shifted Below (Requirement 5) */}
        <div className="border-t border-line p-2">
          <button
            onClick={onToggle}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-muted hover:bg-inset hover:text-ink transition-colors cursor-pointer",
              !isOpen && "justify-center px-0"
            )}
          >
            <CollapseIcon className={cn("size-4 transition-transform duration-200 text-purple-600 dark:text-purple-400", !isOpen && "rotate-180")} />
            {isOpen && <span>Collapse Sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
