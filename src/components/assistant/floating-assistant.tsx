'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChat } from 'ai/react';
import { FloatingAssistantButton } from './floating-assistant-button';
import { AssistantPanel } from './assistant-panel';

interface FloatingAssistantProps {
  onSend?: (message: string) => void;
  onSuggestionSelect?: (id: string, title: string) => void;
  hasNotification?: boolean;
}

export function FloatingAssistant({
  onSend,
  onSuggestionSelect,
  hasNotification = false,
}: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/assistant/chat',
  });

  const handleSuggestion = (id: string, title: string) => {
    onSuggestionSelect?.(id, title);
    append({ role: 'user', content: title || id });
  };

  return (
    <>
      <AnimatePresence>
        <FloatingAssistantButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          hasNotification={hasNotification}
        />
      </AnimatePresence>

      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onExpand={() => {}}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        onSuggestionSelect={handleSuggestion}
      />
    </>
  );
}
