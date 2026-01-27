"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProspectQuickPrompts } from "./ProspectQuickPrompts";
import type { Message, PainPoint } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProspectChatProps {
  prospectSlug: string;
  painPoints: PainPoint[];
  onCtaOffered?: () => void;
}

// Generate a unique session ID
function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  return `prospect-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// Get UTM parameters from URL
function getUtmParams(): { source?: string; campaign?: string; medium?: string } {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || document.referrer || undefined,
    campaign: params.get("utm_campaign") || undefined,
    medium: params.get("utm_medium") || undefined,
  };
}

export function ProspectChat({
  prospectSlug,
  painPoints,
  onCtaOffered,
}: ProspectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (hasStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, hasStarted]);

  // Initialize session
  const initializeSession = useCallback(async (): Promise<string | null> => {
    if (isInitializing) return sessionId;
    if (sessionId) return sessionId;

    setIsInitializing(true);
    try {
      const sid = generateSessionId();
      const utm = getUtmParams();

      const response = await fetch(
        `${API_BASE}/api/public/prospect/${prospectSlug}/chat/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sid,
            utmSource: utm.source,
            utmCampaign: utm.campaign,
            utmMedium: utm.medium,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages(
        data.messages.map((m: { role: string; content: string; timestamp: string }) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      );
      setQuickPrompts(data.quickPrompts || []);
      setHasStarted(true);
      setIsInitializing(false);
      return data.sessionId;
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setIsInitializing(false);
      return null;
    }
  }, [sessionId, isInitializing, prospectSlug]);

  // Auto-start session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Send message
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await initializeSession();
      if (!currentSessionId) return;
    }

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/public/prospect/${prospectSlug}/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: currentSessionId,
            message: messageText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setQuickPrompts(data.quickPrompts || []);

      // Notify parent if CTA was offered
      if (data.ctaOffered && onCtaOffered) {
        onCtaOffered();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Messages container */}
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-5 py-4",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted/60 text-foreground rounded-bl-sm border border-border/30"
                )}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted/60 rounded-2xl rounded-bl-sm px-5 py-4 border border-border/30">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response..."
            disabled={isLoading}
            className="w-full rounded-full bg-muted/20 border border-border/60 px-6 py-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>

        {/* Quick prompts - below input */}
        {quickPrompts.length > 0 && !isLoading && (
          <ProspectQuickPrompts
            prompts={quickPrompts}
            onPromptClick={handleQuickPrompt}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
