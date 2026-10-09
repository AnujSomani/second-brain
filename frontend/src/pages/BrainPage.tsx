import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/brain/Sidebar";
import { ContentCard } from "../components/brain/ContentCard";
import { AddContentModal } from "../components/brain/AddContentModal";
import { ShareBrainModal } from "../components/brain/ShareBrainModal";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ui/button";
import { IconButton } from "../components/ui/icon-button";
import { ThemeToggle } from "../components/ui/theme-toggle";
import {
  PlusIcon,
  ShareIcon,
  MenuIcon,
  TagIcon,
  SearchIcon,
  FolderPlusIcon,
  SparklesIcon,
} from "../icons";
import type { BrainContent, ContentCategory, SidebarFilter } from "../types/brain";
import { cn } from "../lib/cn";
import { ui } from "../lib/ui";
import { fetchContents, addContent, deleteContent } from "../lib/content-api";

const FILTER_LABELS: Record<SidebarFilter, string> = {
  all: "All Notes",
  article: "Articles",
  document: "Documents",
  tweet: "Tweets",
  video: "Videos",
  tags: "Tags",
};

export function BrainPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const [contents, setContents] = useState<BrainContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchContents(1, 100);
      setContents(res.contents);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      if (axiosErr?.response?.status === 401 || axiosErr?.response?.status === 403) {
        navigate("/signin");
        return;
      }
      setError(axiosErr?.response?.data?.message || axiosErr?.message || "Failed to load content");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    contents.forEach((c) => {
      c.tags?.forEach((t) => {
        const clean = t.trim().toLowerCase();
        if (clean) {
          counts[clean] = (counts[clean] || 0) + 1;
        }
      });
    });
    return counts;
  }, [contents]);

  const allTags = useMemo(() => {
    return Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);
  }, [tagCounts]);

  const displayedTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return allTags;
    const q = tagSearchQuery.toLowerCase().trim();
    return allTags.filter((t) => t.includes(q));
  }, [allTags, tagSearchQuery]);

  const totalTaggedNotes = useMemo(() => {
    return contents.filter((c) => c.tags && c.tags.length > 0).length;
  }, [contents]);

  const filteredContents = contents.filter((c) => {
    if (activeFilter === "tags") {
      if (activeTag) {
        return c.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());
      }
      return (c.tags?.length ?? 0) > 0;
    }
    const matchesCategory = activeFilter === "all" || c.category === activeFilter;
    const matchesTag = !activeTag || c.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    return matchesCategory && matchesTag;
  });

  const handleAddContent = useCallback(
    async (data: { title: string; link: string; category: ContentCategory; tags: string[] }) => {
      try {
        const created = await addContent({
          title: data.title,
          link: data.link,
          type: data.category,
          tags: data.tags,
        });
        setContents((prev) => [created, ...prev]);
        setError(null);
        
        setTimeout(() => {
          loadContent();
        }, 3000);
        
        setTimeout(() => {
          loadContent();
        }, 10000);
      } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        alert(errorObj?.response?.data?.message || errorObj?.message || "Failed to add content");
      }
    },
    [loadContent],
  );

  const handleDeleteContent = useCallback(async (id: string) => {
    try {
      await deleteContent(id);
      setContents((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      alert(errorObj?.response?.data?.message || errorObj?.message || "Failed to delete content");
    }
  }, []);

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      sidebar={
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            setActiveFilter(filter);
            setActiveTag(null);
            setTagSearchQuery("");
          }}
        />
      }
      header={
        <>
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => setSidebarOpen((p) => !p)}
              className="lg:hidden p-2"
              title="Open menu"
            >
              <MenuIcon className="size-5" />
            </IconButton>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-ink">{FILTER_LABELS[activeFilter]}</h1>
              <span className={ui.pill}>
                {filteredContents.length} {filteredContents.length === 1 ? "item" : "items"}
              </span>
              {activeTag && activeFilter !== "tags" && (
                <span className={cn(ui.pill, "inline-flex items-center gap-1.5 px-3")}>
                  #{activeTag}
                  <button
                    onClick={() => setActiveTag(null)}
                    className="hover:text-ink cursor-pointer font-bold ml-1 text-sm leading-none"
                    title="Remove tag filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-inset px-3.5 py-2 text-sm font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/25 transition-all cursor-pointer shadow-sm"
              title="Open Brain AI Assistant"
            >
              <SparklesIcon className="size-4 text-amber-500 dark:text-amber-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </Link>
            <Button
              variant="secondary"
              title="Share Brain"
              startIcon={<ShareIcon />}
              className="hidden sm:inline-flex"
              onClick={() => setShareModalOpen(true)}
            />
            <Button
              variant="primary"
              title="Add Content"
              startIcon={<PlusIcon />}
              className="hidden sm:inline-flex"
              onClick={() => setAddModalOpen(true)}
            />
            <IconButton className="sm:hidden" title="Share Brain" onClick={() => setShareModalOpen(true)}>
              <ShareIcon className="size-4" />
            </IconButton>
            <IconButton className="sm:hidden" title="Add Content" onClick={() => setAddModalOpen(true)}>
              <PlusIcon />
            </IconButton>
          </div>
        </>
      }
    >

        {/* ── Content grid ── */}
        <main className="flex-1 px-6 py-8 pb-12">
          {/* ── Dedicated Tag Explorer Filter Panel ── */}
          {activeFilter === "tags" && (
            <div className={cn(ui.panel, "mb-6 bg-panel/85 backdrop-blur-md p-5 shadow-sm")}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                      <TagIcon className="size-4" />
                    </span>
                    <h2 className="text-base font-bold text-ink">
                      Tag Explorer
                    </h2>
                    <span className={ui.pill}>
                      {allTags.length} tags
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Filter notes cleanly by tags. Click any tag below to focus on specific knowledge.
                  </p>
                </div>

                {/* Tag search */}
                <div className="relative w-full sm:w-64 shrink-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                    <SearchIcon className="size-4" />
                  </span>
                  <input
                    type="text"
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    placeholder="Search tags..."
                    className={cn(ui.field, "pl-9 pr-8 py-1.5 text-xs")}
                  />
                  {tagSearchQuery && (
                    <button
                      onClick={() => setTagSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs font-bold cursor-pointer"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Tag pill filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                    activeTag === null
                      ? ui.navActive
                      : "bg-panel text-ink border border-line hover:bg-inset"
                  )}
                >
                  <span>All Tagged</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                      activeTag === null
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200"
                    )}
                  >
                    {totalTaggedNotes}
                  </span>
                </button>

                {displayedTags.map((tag) => {
                  const isSelected = activeTag?.toLowerCase() === tag.toLowerCase();
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(isSelected ? null : tag)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer",
                        isSelected
                          ? ui.navActive
                          : "bg-panel text-ink border border-line hover:bg-inset"
                      )}
                    >
                      <span>#{tag}</span>
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200"
                        )}
                      >
                        {tagCounts[tag]}
                      </span>
                    </button>
                  );
                })}

                {displayedTags.length === 0 && (
                  <p className="text-xs text-muted py-1">
                    No tags matching "{tagSearchQuery}".
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Active Tag Notice when in another category */}
          {activeFilter !== "tags" && activeTag && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl bg-inset border border-line px-4 py-2 text-xs">
              <span className="text-ink">
                Filtering <strong>{FILTER_LABELS[activeFilter]}</strong> by tag:{" "}
                <strong className="font-semibold text-purple-700 dark:text-purple-300">#{activeTag}</strong>
              </span>
              <button
                onClick={() => setActiveTag(null)}
                className="font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white underline cursor-pointer"
              >
                Clear tag filter
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted">Loading your knowledge base...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-rose-500 dark:text-rose-400 mb-4">{error}</p>
              <Button variant="primary" title="Try Again" onClick={loadContent} />
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-2xl bg-purple-50 dark:bg-purple-500/15 ring-1 ring-purple-100 dark:ring-purple-500/25 p-6">
                <FolderPlusIcon className="size-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-ink">
                {activeTag ? `No content found for #${activeTag}` : "No content yet"}
              </h3>
              <p className="mt-1 text-sm text-muted max-w-sm">
                {activeTag
                  ? "Try selecting another tag or clearing the tag filter."
                  : "Start building your second brain by adding articles, videos, tweets, or documents."}
              </p>
              {activeTag ? (
                <Button
                  variant="primary"
                  title="Clear tag filter"
                  className="mt-5"
                  onClick={() => setActiveTag(null)}
                />
              ) : (
                <Button
                  variant="primary"
                  title="Add your first item"
                  startIcon={<PlusIcon />}
                  className="mt-5"
                  onClick={() => setAddModalOpen(true)}
                />
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {filteredContents.map((item) => (
                <ContentCard
                  key={item.id}
                  content={item}
                  onDelete={handleDeleteContent}
                  onShare={() => setShareModalOpen(true)}
                  onSelectTag={(tag) => {
                    setActiveFilter("tags");
                    setActiveTag(tag);
                  }}
                />
              ))}
            </div>
          )}
        </main>

      <AddContentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddContent}
      />
      <ShareBrainModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </AppShell>
  );
}