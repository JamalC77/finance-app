"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Calendar, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { QuickPromptButtons } from "./chat/QuickPromptButtons";
import { cn } from "@/lib/utils";

// Helper function to render message content with clickable links
function renderMessageWithLinks(content: string, onCalendlyClick?: () => void): React.ReactNode {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  const parts = content.split(urlPattern);

  if (parts.length === 1) {
    // No URLs found, return plain text
    return content;
  }

  return parts.map((part, index) => {
    if (urlPattern.test(part)) {
      // Reset lastIndex since we're reusing the pattern
      urlPattern.lastIndex = 0;

      // Check if it's a Calendly link
      const isCalendlyLink = part.includes('calendly.com');

      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (isCalendlyLink && onCalendlyClick) {
              onCalendlyClick();
            }
          }}
          className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          {isCalendlyLink ? 'Book a call here' : part}
        </a>
      );
    }
    return part;
  });
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const INITIAL_QUICK_PROMPTS = [
  "Cash feels tight even though we're growing",
  "I can't tell which customers are actually profitable",
  "I'm not sure we can afford our next hire",
  "I don't trust my numbers",
];

// Generate a unique session ID
function generateSessionId(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem("cfoline_diagnostic_session_id");
  if (stored) return stored;

  const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("cfoline_diagnostic_session_id", newId);
  return newId;
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

export function DiagnosticChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>(INITIAL_QUICK_PROMPTS);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
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

  // Fetch Calendly URL on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/public/chat/calendly-url`)
      .then((res) => res.json())
      .then((data) => setCalendlyUrl(data.url))
      .catch(console.error);
  }, []);

  // Initialize session
  const initializeSession = useCallback(async () => {
    if (isInitializing || sessionId) return;

    setIsInitializing(true);
    try {
      const sid = generateSessionId();
      const utm = getUtmParams();

      const response = await fetch(`${API_BASE}/api/public/chat/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          source: utm.source,
          utmCampaign: utm.campaign,
          utmMedium: utm.medium,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to start session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      setMessages(
        data.messages.map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        }))
      );
      setQuickPrompts(data.quickPrompts || INITIAL_QUICK_PROMPTS);
      setHasStarted(true);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      // Show error state
      setMessages([
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment, or schedule a call directly with our team.",
          timestamp: new Date(),
        },
      ]);
      setHasStarted(true);
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, sessionId]);

  // Send message
  const sendMessage = async (messageText?: string) => {
    const userMessage = (messageText || inputValue).trim();
    if (!userMessage || isLoading) return;

    // Initialize session if needed
    if (!sessionId) {
      await initializeSession();
    }

    setInputValue("");
    setHasStarted(true);

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    setIsLoading(true);

    try {
      const sid = sessionId || generateSessionId();

      const response = await fetch(`${API_BASE}/api/public/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: new Date() },
      ]);

      // Update quick prompts based on conversation context
      if (data.quickPrompts) {
        setQuickPrompts(data.quickPrompts);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again or schedule a call directly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle quick prompt selection
  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  // Handle Calendly click
  const handleCalendlyClick = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE}/api/public/chat/calendly-clicked`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (error) {
        console.error("Failed to track Calendly click:", error);
      }
    }

    if (calendlyUrl) {
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium tracking-wider text-muted-foreground">
              THE CFO LINE
            </span>
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
          </div>
          {calendlyUrl && (
            <button
              onClick={handleCalendlyClick}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Or just schedule a call</span>
              <Calendar className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        {!hasStarted ? (
          /* Initial state - centered prompt */
          <div className="w-full max-w-2xl space-y-8 text-center py-20">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight leading-tight">
              What's keeping you up
              <br />
              <span className="italic text-foreground/70">about your numbers?</span>
            </h1>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell me what's going on..."
                className={cn(
                  "w-full px-6 py-4 pr-14 text-base",
                  "bg-background border border-border/50 rounded-full",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "transition-all duration-200"
                )}
                disabled={isLoading || isInitializing}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading || isInitializing}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "p-2 rounded-full",
                  "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {isLoading || isInitializing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>

            {/* Quick prompts */}
            <QuickPromptButtons
              prompts={quickPrompts}
              onSelect={handleQuickPrompt}
              disabled={isLoading || isInitializing}
            />

            {/* Schedule call link */}
            {calendlyUrl && (
              <div className="pt-8">
                <button
                  onClick={handleCalendlyClick}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span>Or just schedule a call</span>
                  <Sparkles className="h-4 w-4 group-hover:text-primary transition-colors" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Conversation state - chat interface */
          <div className="w-full max-w-2xl flex-1 flex flex-col py-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-6">
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
                      "max-w-[85%] rounded-2xl px-5 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted/50 text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.role === "assistant"
                        ? renderMessageWithLinks(message.content, handleCalendlyClick)
                        : message.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-md px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {!isLoading && quickPrompts.length > 0 && (
              <div className="pb-4">
                <QuickPromptButtons
                  prompts={quickPrompts}
                  onSelect={handleQuickPrompt}
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Input area */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={cn(
                  "w-full px-6 py-4 pr-14 text-base",
                  "bg-background border border-border/50 rounded-full",
                  "text-foreground placeholder:text-muted-foreground/50",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "transition-all duration-200"
                )}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "p-2 rounded-full",
                  "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transition-all duration-200"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
