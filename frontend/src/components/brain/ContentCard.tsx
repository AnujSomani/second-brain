import { cn } from "../../lib/cn";
import type { BrainContent } from "../../types/brain";
import {
  ArticleIcon,
  DocumentIcon,
  TweetIcon,
  VideoIcon,
  ShareIcon,
  TrashIcon,
} from "../../icons";

interface ContentCardProps {
  content: BrainContent;
  onDelete: (id: string) => void;
  onShare: (content: BrainContent) => void;
  onSelectTag?: (tag: string) => void;
  readOnly?: boolean; // For shared brain view
}

function CategoryIcon({ category }: { category: BrainContent["category"] }) {
  const baseClass = "size-4 shrink-0";
  switch (category) {
    case "article":
      return <ArticleIcon className={baseClass} />;
    case "document":
      return <DocumentIcon className={baseClass} />;
    case "tweet":
      return <TweetIcon className={baseClass} />;
    case "video":
      return <VideoIcon className={baseClass} />;
  }
}

function ProviderBadge({ providerName, siteName }: { providerName?: string | null; siteName?: string | null }) {
  if (!providerName && !siteName) return null;

  const providerEmojis: Record<string, string> = {
    youtube: "🎥",
    twitter: "𝕏",
    linkedin: "💼",
    "linkedin-job": "💼",
    "linkedin-post": "💼",
    github: "🐙",
    notion: "📝",
    medium: "Ⓜ️",
    devto: "👨‍💻",
    stackoverflow: "📚",
    reddit: "🤖",
    instagram: "📸",
    facebook: "👥",
    tiktok: "🎵",
  };

  const emoji = providerEmojis[providerName || ""] || "🔗";
  const displayName = siteName || providerName;

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 shadow-sm">
      <span className="text-sm">{emoji}</span>
      <span className="truncate max-w-[120px]">{displayName}</span>
    </div>
  );
}

function JobPostingCard({ metadata }: { metadata: any }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/15 border border-blue-200/40 dark:border-blue-500/20 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="size-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 text-2xl shadow-md">
          💼
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {metadata.jobTitle && (
            <h4 className="font-bold text-base text-blue-900 dark:text-blue-100 leading-tight">
              {metadata.jobTitle}
            </h4>
          )}
          {metadata.company && (
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{metadata.company}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs text-blue-600 dark:text-blue-400">
            {metadata.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 font-medium">
                📍 {metadata.location}
              </span>
            )}
            {metadata.employmentType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 font-medium">
                💼 {metadata.employmentType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RepositoryCard({ metadata, author }: { metadata: any; author?: string | null }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-slate-50/80 to-gray-50/80 dark:from-slate-950/20 dark:to-gray-950/15 border border-slate-200/40 dark:border-slate-500/20 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="size-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 text-2xl shadow-md">
          🐙
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          {author && (
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{author}</p>
          )}
          <div className="flex flex-wrap gap-2 text-xs">
            {metadata.language && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 font-medium">
                💻 {metadata.language}
              </span>
            )}
            {metadata.stars && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-medium">
                ⭐ {metadata.stars}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TweetPreviewCard({ text }: { text: string }) {
  const cleanText = text.replace(/^Tweet \/ X post by .+\n+Link: .+\n+/i, "").trim();

  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/20 dark:to-blue-950/15 border border-sky-200/40 dark:border-sky-500/20 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="size-11 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0 text-white font-bold text-lg shadow-md">
          𝕏
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-wrap line-clamp-6">
            {cleanText}
          </p>
        </div>
      </div>
    </div>
  );
}

function ArticlePreviewCard({ text }: { text: string }) {
  return (
    <div className="my-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/15 dark:to-teal-950/15 border border-emerald-200/40 dark:border-emerald-500/20 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 text-white text-lg shadow-md">
          📰
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 line-clamp-5">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function getYouTubeThumbnail(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;
    if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v");
    } else if (parsed.hostname.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    }
    if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  } catch {
  }
  return null;
}

function getThumbnailUrl(content: BrainContent): string | null {
  if (content.thumbnailUrl) {
    return content.thumbnailUrl;
  }

  if (content.category === "video") {
    return getYouTubeThumbnail(content.link);
  }

  return null;
}

function isErrorDescription(description: string): boolean {
  const errorPatterns = [
    /could not be scrop/i,
    /external page/i,
    /indexed via user metadata/i,
    /Type:\s*(article|document|video|tweet)/i,
    /^Title:/i,
    /^Link: https?:\/\//i,
  ];
  
  return errorPatterns.some(pattern => pattern.test(description));
}

function isFallbackPreview(preview: string): boolean {
  const lines = preview.trim().split('\n').filter(l => l.trim());
  
  if (lines.length <= 2) {
    return lines.some(line => /^https?:\/\//i.test(line.trim()));
  }
  
  return false;
}

function getIconPlaceholder(content: BrainContent): string {
  const iconConfig = {
    article: { emoji: '📄', bgColor: '#eff6ff', iconColor: '#3b82f6' },
    document: { emoji: '📖', bgColor: '#faf5ff', iconColor: '#9333ea' },
    video: { emoji: '▶️', bgColor: '#fef2f2', iconColor: '#ef4444' },
    tweet: { emoji: '𝕏', bgColor: '#f0f9ff', iconColor: '#0ea5e9' },
  };

  const config = iconConfig[content.category] || { emoji: '🔗', bgColor: '#f8fafc', iconColor: '#64748b' };
  
  const svg = `
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="200" fill="${config.bgColor}" />
      <text x="200" y="100" font-size="80" text-anchor="middle" dominant-baseline="middle" opacity="0.9">${config.emoji}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function ContentCard({
  content,
  onDelete,
  onShare,
  onSelectTag,
  readOnly = false,
}: ContentCardProps) {
  const thumbnail = getThumbnailUrl(content);
  const iconPlaceholder = getIconPlaceholder(content);
  const hasMetadata = content.metadata && Object.keys(content.metadata).length > 0;

  const showJobCard = hasMetadata && content.metadata?.type === "job";
  const showRepoCard = hasMetadata && content.metadata?.type === "repository";
  const showTweetCard = content.category === "tweet" && content.preview && !isFallbackPreview(content.preview);
  const showArticleCard = content.category === "article" && content.preview && content.preview.length > 50 && !isFallbackPreview(content.preview);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("[data-interactive]")
    ) {
      return;
    }
    window.open(content.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300",
        "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
        "hover:border-purple-300 dark:hover:border-purple-500/50",
        "shadow-sm hover:shadow-xl hover:shadow-purple-500/10 dark:shadow-purple-950/20",
        "hover:-translate-y-1 cursor-pointer"
      )}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div className="flex flex-col gap-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="text-purple-500 dark:text-purple-400">
              <CategoryIcon category={content.category} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug flex-1">
              {content.title}
            </h3>
          </div>
          {(content.providerName || content.siteName) && (
            <ProviderBadge providerName={content.providerName} siteName={content.siteName} />
          )}
        </div>
        {!readOnly && (
          <div
            data-interactive
            className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <button
              onClick={() => onShare(content)}
              className="rounded-lg p-2 text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer"
              title="Share"
            >
              <ShareIcon className="size-4" />
            </button>
            <button
              onClick={() => onDelete(content.id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
              title="Delete"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content body - with special cards for jobs, repos, etc. */}
      <div className="flex-1 px-5 pb-2">
        {showJobCard && content.metadata ? (
          <JobPostingCard metadata={content.metadata} />
        ) : showRepoCard && content.metadata ? (
          <RepositoryCard metadata={content.metadata} author={content.author} />
        ) : showTweetCard ? (
          <TweetPreviewCard text={content.preview!} />
        ) : showArticleCard ? (
          <ArticlePreviewCard text={content.preview!} />
        ) : (
          <>
            {/* Image preview */}
            <div className="my-3 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 relative group/image">
              <img
                src={thumbnail || iconPlaceholder}
                alt={content.title}
                className={cn(
                  "h-40 w-full object-cover",
                  thumbnail ? "transition-transform duration-500 group-hover/image:scale-110" : "object-contain p-8"
                )}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== iconPlaceholder) {
                    img.src = iconPlaceholder;
                  }
                }}
              />
            </div>

            {/* Text description if available and no special card */}
            {content.description && !isErrorDescription(content.description) && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
                  {content.description}
                </p>
              </div>
            )}

            {/* Author and date metadata */}
            {(content.author || content.publishedDate) && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                {content.author && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                    <span className="text-sm">✍️</span>
                    <span>{content.author}</span>
                  </span>
                )}
                {content.publishedDate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium">
                    <span className="text-sm">📅</span>
                    <span>{formatDate(content.publishedDate)}</span>
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Tags */}
      {content.tags.length > 0 && (
        <div data-interactive className="flex flex-wrap gap-2 px-5 pb-4">
          {content.tags.map((tag) => (
            readOnly ? (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold",
                  "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
                  "border border-purple-200 dark:border-purple-700"
                )}
              >
                #{tag}
              </span>
            ) : (
              <button
                key={tag}
                type="button"
                onClick={() => onSelectTag && onSelectTag(tag)}
                className={cn(
                  "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                  "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
                  "border border-purple-200 dark:border-purple-700",
                  "hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600",
                  "hover:shadow-sm"
                )}
              >
                #{tag}
              </button>
            )
          ))}
        </div>
      )}

      {/* Footer with processing status */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Added {formatDate(content.addedDate)}
          </p>
          {content.status && content.status !== "ready" && (
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-lg font-semibold border",
              content.status === "processing" && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
              content.status === "pending" && "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
              content.status === "failed" && "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
            )}>
              {content.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}