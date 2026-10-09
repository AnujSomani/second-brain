import { useState } from "react";
import type { ContentCategory } from "../../types/brain";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "../ui/modal";
import { cn } from "../../lib/cn";
import { ui } from "../../lib/ui";

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    link: string;
    category: ContentCategory;
    tags: string[];
  }) => void;
}

const CATEGORY_OPTIONS: Array<{ value: ContentCategory; label: string }> = [
  { value: "article", label: "Article" },
  { value: "document", label: "Document" },
  { value: "tweet", label: "Tweet" },
  { value: "video", label: "Video" },
];

export function AddContentModal({
  isOpen,
  onClose,
  onAdd,
}: AddContentModalProps) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [category, setCategory] = useState<ContentCategory>("article");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onAdd({
      title: title.trim() || "Untitled",
      link: link.trim(),
      category,
      tags,
    });

    setTitle("");
    setLink("");
    setTagsInput("");
    setCategory("article");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Content">
      <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. React Best Practices"
        />
        <Input
          label="Link *"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          required
        />
        <Input
          label="Tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="productivity, learning (comma separated)"
        />

        <div>
          <p className={cn(ui.label, "mb-2")}>Category</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 border cursor-pointer",
                  category === opt.value
                    ? ui.navActive
                    : "border-line text-muted hover:border-purple-300 hover:bg-inset dark:hover:border-purple-400/50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" title="Cancel" onClick={onClose} />
          <Button type="submit" variant="primary" title="Add to Brain" />
        </div>
      </form>
    </Modal>
  );
}