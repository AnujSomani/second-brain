import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ContentCard } from "../components/brain/ContentCard";
import { ThemeToggle } from "../components/ui/theme-toggle";
import { Button } from "../components/ui/button";
import { ArrowLeftIcon, UserIcon } from "../icons";
import type { BrainContent, ContentCategory } from "../types/brain";
import { cn } from "../lib/cn";
import { fetchSharedBrain } from "../lib/content-api";
import brain from "../assets/brain.jpg";

export function SharedBrainPage() {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [contents, setContents] = useState<BrainContent[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ContentCategory | "all">("all");

  useEffect(() => {
    if (!shareLink) return;
    
    setIsLoading(true);
    setError(null);
    
    fetchSharedBrain(shareLink)
      .then((data) => {
        setUsername(data.username);
        const mappedContent: BrainContent[] = data.content.map((c: any) => ({
          id: String(c.id),
          title: c.title,
          link: c.link,
          category: c.type,
          tags: Array.isArray(c.tags) ? c.tags.map((t: any) => t.title) : [],
          addedDate: c.createdAt,
          preview: c.description || c.extractedText?.slice(0, 200) || "",
          thumbnailUrl: c.thumbnailUrl,
          description: c.description,
          embedHtml: c.embedHtml,
          favicon: c.favicon,
          siteName: c.siteName,
          author: c.author,
          publishedDate: c.publishedDate,
          providerName: c.providerName,
          metadata: c.metadata,
          status: c.status,
        }));
        setContents(mappedContent);
      })
      .catch((err: any) => {
        setError(err?.response?.data?.message || err?.message || "Failed to load shared brain");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [shareLink]);

  const stats = useMemo(() => {
    const byCategory = {
      article: 0,
      document: 0,
      tweet: 0,
      video: 0,
    };
    
    contents.forEach((c) => {
      byCategory[c.category]++;
    });

    return {
      total: contents.length,
      byCategory,
    };
  }, [contents]);

  const filteredContents = useMemo(() => {
    if (activeFilter === "all") return contents;
    return contents.filter((c) => c.category === activeFilter);
  }, [contents, activeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="size-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-muted">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="size-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Share Link Not Found</h1>
          <p className="text-muted">{error}</p>
          <Link to="/landing">
            <Button variant="primary" title="Go to Home" startIcon={<ArrowLeftIcon />} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-surface/85 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
              <Link to="/landing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="size-8 rounded-lg overflow-hidden ring-2 ring-purple-300 shadow-sm">
                  <img src={brain} alt="Brainly" className="size-full object-cover" />
                </div>
                <span className="text-xl font-bold text-ink">Brainly</span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                <UserIcon className="size-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {username}'s Brain
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link to="/signin">
                <Button variant="secondary" title="Sign In" className="hidden sm:inline-flex" />
              </Link>
              <Link to="/signup">
                <Button variant="primary" title="Get Started" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info & Stats */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <UserIcon className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">
                {username}'s Brain
              </h1>
              <p className="text-sm text-muted">
                Shared collection of {stats.total} saved {stats.total === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          {/* Category Stats - Now Clickable */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg border transition-all cursor-pointer",
                activeFilter === "all"
                  ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700"
              )}
            >
              <span className={cn(
                "text-sm font-semibold",
                activeFilter === "all"
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-slate-700 dark:text-slate-300"
              )}>
                📚 All ({stats.total})
              </span>
            </button>
            {stats.byCategory.article > 0 && (
              <button
                onClick={() => setActiveFilter("article")}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  activeFilter === "article"
                    ? "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-600 shadow-sm"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  activeFilter === "article"
                    ? "text-blue-800 dark:text-blue-200"
                    : "text-blue-700 dark:text-blue-300"
                )}>
                  📄 {stats.byCategory.article} Articles
                </span>
              </button>
            )}
            {stats.byCategory.document > 0 && (
              <button
                onClick={() => setActiveFilter("document")}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  activeFilter === "document"
                    ? "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600 shadow-sm"
                    : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-600"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  activeFilter === "document"
                    ? "text-purple-800 dark:text-purple-200"
                    : "text-purple-700 dark:text-purple-300"
                )}>
                  📖 {stats.byCategory.document} Documents
                </span>
              </button>
            )}
            {stats.byCategory.video > 0 && (
              <button
                onClick={() => setActiveFilter("video")}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  activeFilter === "video"
                    ? "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-600 shadow-sm"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  activeFilter === "video"
                    ? "text-red-800 dark:text-red-200"
                    : "text-red-700 dark:text-red-300"
                )}>
                  ▶️ {stats.byCategory.video} Videos
                </span>
              </button>
            )}
            {stats.byCategory.tweet > 0 && (
              <button
                onClick={() => setActiveFilter("tweet")}
                className={cn(
                  "px-4 py-2 rounded-lg border transition-all cursor-pointer",
                  activeFilter === "tweet"
                    ? "bg-sky-100 dark:bg-sky-900/40 border-sky-300 dark:border-sky-600 shadow-sm"
                    : "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 hover:border-sky-300 dark:hover:border-sky-600"
                )}
              >
                <span className={cn(
                  "text-sm font-semibold",
                  activeFilter === "tweet"
                    ? "text-sky-800 dark:text-sky-200"
                    : "text-sky-700 dark:text-sky-300"
                )}>
                  𝕏 {stats.byCategory.tweet} Tweets
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {filteredContents.length === 0 ? (
          <div className="text-center py-16">
            <div className="size-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              {activeFilter !== "all" ? `No ${activeFilter}s found` : "No content yet"}
            </h3>
            <p className="text-muted">
              {activeFilter !== "all" 
                ? "Try selecting a different category or view all content." 
                : "This brain is empty. Check back later!"}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 px-4 py-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-semibold text-sm hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
              >
                View All Content
              </button>
            )}
          </div>
        ) : (
          <div className={cn(
            "grid gap-6",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {filteredContents.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onDelete={() => {}} // No delete on shared view
                onShare={() => {}} // No share on shared view
                readOnly={true} // Hide action buttons
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-line py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted">
            Want to create your own brain?{" "}
            <Link to="/signup" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}