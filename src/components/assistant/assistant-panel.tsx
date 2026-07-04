'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AssistantHeader } from './assistant-header';
import { SuggestionCards } from './suggestion-cards';
import { AssistantInput } from './assistant-input';
import { cn } from '@/lib/utils';
import { Message } from 'ai';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef } from 'react';

interface AssistantPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onSuggestionSelect?: (id: string, text: string) => void;
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}

export function AssistantPanel({
  isOpen,
  onClose,
  onExpand,
  onSuggestionSelect,
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: AssistantPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed bottom-24 right-4 z-40 w-full max-w-sm overflow-hidden rounded-3xl',
              'border border-white/10 bg-background/90 shadow-2xl',
              'backdrop-blur-2xl',
              'md:bottom-auto md:right-8 md:top-24',
              'flex flex-col max-h-[calc(100vh-120px)] md:max-h-[calc(100vh-180px)]',
              'h-[600px]' // Give it a fixed height so messages can scroll
            )}
          >
            <AssistantHeader onClose={onClose} onExpand={onExpand} />

            <div className="flex-1 overflow-y-auto p-5" ref={scrollRef}>
              {messages.length === 0 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-foreground">
                      Hi there! 👋
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      How can I help you today? Pick an action below or ask me
                      anything.
                    </p>
                  </div>
                  <SuggestionCards onSelect={onSuggestionSelect} />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2.5 max-w-[80%] text-sm',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-muted/50 border border-white/5 rounded-tl-sm text-foreground prose prose-sm prose-invert'
                        )}
                      >
                        {message.role === 'assistant' ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          <p>{message.content}</p>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl bg-muted/50 border border-white/5 px-4 py-3 rounded-tl-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <AssistantInput 
                input={input} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit}
                isLoading={isLoading} 
                placeholder="Ask me anything..." 
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
