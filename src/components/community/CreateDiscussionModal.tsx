'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  writeBatch,
  doc,
  collection,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { POINTS } from '@/lib/points';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface CreateDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

export default function CreateDiscussionModal({
  isOpen,
  onClose,
  userId,
  userName,
  onSuccess,
}: CreateDiscussionModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentTab, setContentTab] = useState<'write' | 'preview'>('write');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const [titleTouched, setTitleTouched] = useState(false);
  const [contentTouched, setContentTouched] = useState(false);
  const [tagsTouched, setTagsTouched] = useState(false);

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  const tagsArray = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  // Case-insensitive deduplication while preserving original casing of first occurrence
  const uniqueTags: string[] = [];
  const seenTags = new Set<string>();
  for (const tag of tagsArray) {
    const lowerTag = tag.toLowerCase();
    if (!seenTags.has(lowerTag)) {
      seenTags.add(lowerTag);
      uniqueTags.push(tag);
    }
  }

  const isTitleValid = trimmedTitle.length >= 5 && trimmedTitle.length <= 100;
  const isContentValid = trimmedContent.length >= 20;
  const isTagsValid = uniqueTags.length <= 5;

  const isFormValid = isTitleValid && isContentValid && isTagsValid;

  let titleError = '';
  if (titleTouched) {
    if (title.length > 0 && trimmedTitle.length === 0) {
      titleError = 'Title cannot be only whitespace.';
    } else if (trimmedTitle.length < 5) {
      titleError = 'Title must be at least 5 characters long.';
    } else if (trimmedTitle.length > 100) {
      titleError = 'Title cannot exceed 100 characters.';
    }
  }

  let contentError = '';
  if (contentTouched) {
    if (content.length > 0 && trimmedContent.length === 0) {
      contentError = 'Content cannot be only whitespace.';
    } else if (trimmedContent.length < 20) {
      contentError = 'Content must be at least 20 characters long.';
    }
  }

  let tagsError = '';
  if (tagsTouched) {
    if (uniqueTags.length > 5) {
      tagsError = 'Maximum of 5 unique tags allowed.';
    }
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);

    try {
      const batch = writeBatch(db);

      const discussionRef = doc(collection(db, 'discussions'));
      const memberRef = doc(db, 'members', userId);
      batch.set(discussionRef, {
        authorId: userId,
        authorName: userName,
        title: trimmedTitle,
        content: trimmedContent,
        tags: uniqueTags,
        likes: [],
        replyCount: 0,
        createdAt: serverTimestamp(),
      });
      batch.update(memberRef, {
        points: increment(POINTS.CREATE_DISCUSSION),
      });
      await batch.commit();
      setTitle('');
      setContent('');
      setContentTab('write');
      setTags('');
      setTitleTouched(false);
      setContentTouched(false);
      setTagsTouched(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating discussion:', error);
      alert('Failed to create discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold">Start a Discussion</h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTitleTouched(true)}
              className={`w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                titleError
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-border focus:ring-primary/50'
              }`}
              placeholder="What's on your mind?"
              required
            />
            {titleError && (
              <p className="text-red-500 text-xs mt-1" id="title-error">
                {titleError}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Content</label>
              <div className="flex bg-secondary border border-border/30 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setContentTab('write')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${contentTab === 'write' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab('preview')}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${contentTab === 'preview' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {contentTab === 'write' ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => setContentTouched(true)}
                className={`w-full bg-background border rounded-lg px-4 py-2 min-h-[200px] focus:outline-none focus:ring-2 resize-y ${
                  contentError
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-border focus:ring-primary/50'
                }`}
                placeholder="Share your thoughts, ask questions, or showcase your work... (Markdown supported)"
                required
              />
            ) : (
              <div className="w-full bg-background border border-border rounded-lg px-4 py-2 min-h-[200px] markdown-body overflow-y-auto">
                {content ? (
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                  >
                    {DOMPurify.sanitize(content)}
                  </ReactMarkdown>
                ) : (
                  <span className="text-muted-foreground italic">
                    Nothing to preview
                  </span>
                )}
              </div>
            )}
            {contentError && (
              <p className="text-red-500 text-xs mt-1" id="content-error">
                {contentError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onBlur={() => setTagsTouched(true)}
              className={`w-full bg-background border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                tagsError
                  ? 'border-red-500 focus:ring-red-500/50'
                  : 'border-border focus:ring-primary/50'
              }`}
              placeholder="e.g., Help, Showcase, React, Firebase"
            />
            {tagsError && (
              <p className="text-red-500 text-xs mt-1" id="tags-error">
                {tagsError}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
