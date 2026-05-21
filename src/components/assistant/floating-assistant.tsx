"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FloatingAssistantButton } from "./floating-assistant-button";
import { AssistantPanel } from "./assistant-panel";

interface FloatingAssistantProps {
    onSend?: (message: string) => void;
    onSuggestionSelect?: (id: string) => void;
    hasNotification?: boolean;
}

export function FloatingAssistant({
    onSend,
    onSuggestionSelect,
    hasNotification = false,
}: FloatingAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
        document.getElementById("floating-assistant-trigger")?.focus();
    };

    return (
        <>
            <AnimatePresence>
                <FloatingAssistantButton
                    isOpen={isOpen}
                    onClick={() => setIsOpen((prev) => !prev)}
                    hasNotification={hasNotification}
                />
            </AnimatePresence>

            <AssistantPanel
                isOpen={isOpen}
                onClose={handleClose}
                onExpand={() => {}}
                onSend={(message) => {
                    onSend?.(message);
                    handleClose();
                }}
                onSuggestionSelect={(id) => {
                    onSuggestionSelect?.(id);
                    handleClose();
                }}
            />
        </>
    );
}
