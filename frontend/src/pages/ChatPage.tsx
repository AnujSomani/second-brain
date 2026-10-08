import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/brain/Sidebar";
import { AppShell } from "../layouts/AppShell";
import { IconButton } from "../components/ui/icon-button";
import { ThemeToggle } from "../components/ui/theme-toggle";
import type { ChatMessage, ContentCategory } from "../types/brain";
import { cn } from "../lib/cn";
import { sendChatMessage } from "../lib/chat-api";
import {
  MenuIcon,
  SparklesIcon,
  UserIcon,
  SendIcon,
  RefreshIcon,
} from "../icons";

/* ──────────────────── Initial friendly welcome message ──────────────────── */
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    text: "Hello! I am your Brainly AI assistant. I have indexed all your saved articles, documents, tweets, and videos. Ask me anything about your saved knowledge!",
    timestamp: Date.now() - 60000,
    sources: [],
  },
];

export function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Handle send
  const handleSend = useCallback(async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const data = await sendChatMessage(query);
      const aiSources: Array<{
        id: string;
        title: string;
        link: string;
        category: ContentCategory;
        thumbnailUrl?: string | null;
      }> = (data.sources || []).map((s, idx) => ({
        id: String(idx),
        title: s.title || s.link,
        link: s.link,
        category: (s.type || "article") as ContentCategory,
        thumbnailUrl: s.thumbnailUrl,
      }));

      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: data.answer || "I could not find an answer in your saved content.",
        timestamp: Date.now(),
        sources: aiSources,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg = axiosErr?.response?.data?.message || axiosErr?.message || "Failed to reach AI assistant. Please try again.";
      const errorResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: `Error: ${errMsg}`,
        timestamp: Date.now(),
        sources: [],
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsThinking(false);
    }
  }, [input, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      sidebar={
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((p) => !p)}
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

            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
                <SparklesIcon className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-ink flex items-center gap-2">
                  Ask Brainly AI
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </h1>
                <p className="text-xs text-muted">
                  Semantic Q&A across all your saved notes & links
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Clear conversation */}
            <button
              onClick={handleClearChat}
              className="text-xs font-semibold text-muted hover:text-ink px-3 py-1.5 rounded-xl border border-line hover:bg-inset transition-colors cursor-pointer"
              title="Reset conversation"
            >
              Clear Chat
            </button>
            <ThemeToggle />
          </div>
        </>
      }
      footer={
        <div className="sticky bottom-0 z-10 border-t border-line bg-page/90 backdrop-blur-xl px-4 sm:px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center bg-panel rounded-2xl border border-line shadow-lg shadow-purple-900/5 focus-within:ring-2 focus-within:ring-purple-500/25 focus-within:border-purple-500 transition-all p-1.5"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask anything about your saved notes, links, and documents..."
                className="w-full resize-none bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none max-h-32"
              />

              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="inline-flex items-center justify-center size-10 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/30 hover:bg-purple-700 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                title="Send query (Enter)"
              >
                <SendIcon className="size-4.5" />
              </button>
            </form>

            <p className="mt-2 text-center text-[11px] text-muted">
              Brain AI searches your knowledge repository. Press <kbd className="px-1.5 py-0.5 rounded bg-inset text-purple-700 dark:text-purple-300 font-mono text-[10px]">Enter</kbd> to submit.
            </p>
          </div>
        </div>
      }
    >

        {/* Chat Conversation Scroll Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Messages stream */}
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-start gap-3.5",
                    isUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                      isUser
                        ? "bg-purple-600 text-white"
                        : "bg-gradient-to-tr from-purple-600 to-amber-500 text-white"
                    )}
                  >
                    {isUser ? (
                      <UserIcon className="size-4.5" />
                    ) : (
                      <SparklesIcon className="size-4.5" />
                    )}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-sm text-sm leading-relaxed",
                      isUser
                        ? "bg-purple-600 text-white rounded-tr-sm shadow-purple-500/20"
                        : "bg-panel text-ink border border-line rounded-tl-sm"
                    )}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Sources Badges */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                          Referenced Sources:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.sources.map((src) => (
                            <a
                              key={src.id}
                              href={src.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-500/30 text-xs font-semibold hover:border-purple-300 dark:hover:border-purple-400/50 hover:scale-[1.02] transition-all cursor-pointer"
                            >
                              <span>
                                {src.category === "video" ? "🎬" : src.category === "tweet" ? "🐦" : src.category === "article" ? "📰" : "📄"}
                              </span>
                              <span className="truncate max-w-[200px]">{src.title}</span>
                              <span className="text-[10px] opacity-70">↗</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking pulsating indicator */}
            {isThinking && (
              <div className="flex items-center gap-3.5">
                <div className="size-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 text-white flex items-center justify-center shrink-0">
                  <RefreshIcon className="size-4.5 animate-spin" />
                </div>
                <div className="bg-panel border border-line rounded-3xl px-4 py-3 text-xs font-semibold text-purple-600 dark:text-purple-300 flex items-center gap-2 shadow-sm">
                  <span>Searching your brain</span>
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="size-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

          <div ref={messagesEndRef} />
        </div>
      </main>
    </AppShell>
  );
}
