'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function AssistantInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  disabled = false,
  placeholder = 'Ask me anything...',
}: AssistantInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Only submit if there's actually text, otherwise we might trigger empty submits
      if (input.trim() && !disabled && !isLoading) {
         const formEvent = new Event('submit', { bubbles: true, cancelable: true });
         e.currentTarget.form?.dispatchEvent(formEvent);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-gradient-to-t from-background via-background/95 to-transparent px-5 py-4 shrink-0"
    >
      <motion.div
        className={cn(
          'overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05]',
          'backdrop-blur-xl transition-all',
          'focus-within:border-cyan-400/50 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className={cn(
            'w-full resize-none border-0 bg-transparent px-4 py-3 text-sm',
            'outline-none placeholder:text-muted-foreground',
            'text-foreground disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Message input"
        />

        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              'border border-white/10 bg-white/5 text-muted-foreground',
              'transition hover:border-white/20 hover:bg-white/10 hover:text-foreground'
            )}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>

          <motion.button
            type="submit"
            disabled={!input.trim() || disabled || isLoading}
            whileHover={{ scale: input.trim() && !disabled && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: input.trim() && !disabled && !isLoading ? 0.95 : 1 }}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              'bg-gradient-to-r from-cyan-500 to-violet-500',
              'text-white shadow-lg shadow-cyan-500/20',
              'transition disabled:cursor-not-allowed disabled:opacity-40',
              'hover:shadow-lg hover:shadow-cyan-500/30'
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </motion.div>

      <p className="mt-2 text-xs text-muted-foreground/70 text-center">
        Press Enter to send • Shift+Enter for new line
      </p>
    </form>
  );
}
