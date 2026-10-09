import { useCallback, useEffect, useState } from "react";
import { shareBrain, getShareStatus } from "../../lib/content-api";
import { CheckIcon, CopyIcon, ShareIcon } from "../../icons";
import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";

interface ShareBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareBrainModal({ isOpen, onClose }: ShareBrainModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string>("");
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    getShareStatus()
      .then((status) => {
        if (isMounted) {
          setIsShared(status.isShared);
          setShareLink(status.shareLink || "");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to load share status");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleToggleShare = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isShared) {
        await shareBrain(false);
        setIsShared(false);
        setShareLink("");
      } else {
        const link = await shareBrain(true);
        if (link) {
          setIsShared(true);
          setShareLink(link);
        } else {
          setError("Could not generate share link");
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to update sharing");
    } finally {
      setLoading(false);
    }
  }, [isShared]);

  const handleCopy = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  }, [shareLink]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Your Brain"
      footer={<Button type="button" variant="secondary" title="Done" onClick={onClose} />}
    >
      <div className="px-6 py-5 space-y-4">
        <p className="text-sm text-muted">
          {isShared 
            ? "Your brain is currently shared. Anyone with this link can view your saved content."
            : "Enable sharing to generate a public link that others can view."}
        </p>

        {error ? <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p> : null}

        {/* Toggle Share Button */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center transition-colors",
              isShared 
                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                : "bg-slate-200 dark:bg-slate-700 text-slate-400"
            )}>
              <ShareIcon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {isShared ? "Sharing Enabled" : "Sharing Disabled"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isShared ? "Your brain is public" : "Your brain is private"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant={isShared ? "secondary" : "primary"}
            title={isShared ? "Disable" : "Enable"}
            disabled={loading}
            onClick={handleToggleShare}
          />
        </div>

        {/* Share Link (only shown when enabled) */}
        {isShared && shareLink && (
          <div className="flex items-center gap-2">
            <div className={cn(ui.inset, "flex-1 overflow-hidden px-4 py-2.5")}>
              <p className="truncate text-sm text-ink select-all">
                {shareLink}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              title={copied ? "Copied" : "Copy"}
              startIcon={copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              onClick={handleCopy}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}