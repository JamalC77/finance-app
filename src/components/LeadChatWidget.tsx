"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  sessionId: string;
  messages: Message[];
  isReturningVisitor: boolean;
}

// Generate a unique session ID
function generateSessionId(): string {
  const stored = localStorage.getItem("cfoline_session_id");
  if (stored) return stored;

  const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("cfoline_session_id", newId);
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function LeadChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hide pulse after first interaction
  useEffect(() => {
    if (isOpen) {
      setShowPulse(false);
    }
  }, [isOpen]);

  // Fetch Calendly URL
  useEffect(() => {
    fetch(`${API_BASE}/api/public/chat/calendly-url`)
      .then((res) => res.json())
      .then((data) => setCalendlyUrl(data.url))
      .catch(console.error);
  }, []);

  // Initialize or resume session when chat opens
  const initializeSession = useCallback(async () => {
    if (hasInitialized) return;

    setIsLoading(true);
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

      const data: ChatSession = await response.json();
      setSessionId(data.sessionId);
      setMessages(
        data.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
      );
      setHasInitialized(true);
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm having trouble connecting right now. Please try again in a moment, or book a call directly with our team.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [hasInitialized]);

  // Initialize when chat opens
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      initializeSession();
    }
  }, [isOpen, hasInitialized, initializeSession]);

  // Send message
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading || !sessionId) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/public/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);

      // Show error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again or book a call directly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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

  // Render message content with Calendly link detection
  const renderMessageContent = (content: string) => {
    // Check if message contains a calendly link
    if (content.includes("calendly.com") && calendlyUrl) {
      const parts = content.split(/(https?:\/\/calendly\.com[^\s]*)/);
      return parts.map((part, i) => {
        if (part.includes("calendly.com")) {
          return (
            <button
              key={i}
              onClick={handleCalendlyClick}
              className="text-primary underline hover:text-primary/80 inline-flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              Book a call
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      });
    }
    return content;
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
          showPulse ? "animate-pulse" : ""
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">CFO Line</h3>
                <p className="text-xs opacity-80">We typically reply instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {renderMessageContent(message.content)}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick action */}
          {calendlyUrl && (
            <div className="border-t px-4 py-2 bg-muted/30">
              <button
                onClick={handleCalendlyClick}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Book a Discovery Call
              </button>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full"
                disabled={!inputValue.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
