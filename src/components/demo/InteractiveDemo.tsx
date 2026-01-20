"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Send, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { conversationFlows, Prompt, Response } from "./conversationFlows";
import { PanelType, HighlightType } from "./demoData";
import { CashFlowPanel } from "./CashFlowPanel";
import { PnLPanel } from "./PnLPanel";
import { ARPanel } from "./ARPanel";
import { ProvidersPanel } from "./ProvidersPanel";
import { DemoCTAPanel } from "./DemoCTAPanel";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Message {
  type: "user" | "bot";
  content: string;
}

// Generate a unique session ID
function generateSessionId(): string {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem("cfoline_demo_session_id");
  if (stored) return stored;
  const newId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("cfoline_demo_session_id", newId);
  return newId;
}

export function InteractiveDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<PanelType>(null);
  const [currentHighlight, setCurrentHighlight] = useState<HighlightType>(null);
  const [currentPrompts, setCurrentPrompts] = useState<Prompt[]>(conversationFlows.initial.prompts);
  const [showCTA, setShowCTA] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and fetch Calendly URL
  useEffect(() => {
    setSessionId(generateSessionId());
    fetch(`${API_BASE}/api/public/chat/calendly-url`)
      .then((res) => res.json())
      .then((data) => setCalendlyUrl(data.url))
      .catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePromptClick = useCallback(async (promptId: string) => {
    const prompt = currentPrompts.find((p) => p.id === promptId);
    if (!prompt) return;

    setConversationStarted(true);
    setCurrentPrompts([]);

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: prompt.label }]);

    // Get response
    const response = conversationFlows.responses[promptId] as Response | undefined;
    if (!response) return;

    setIsTyping(true);

    // Type out messages with delay
    for (let i = 0; i < response.messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMessages((prev) => [...prev, { type: "bot", content: response.messages[i] }]);
    }

    setIsTyping(false);

    // Show panel if specified
    if (response.showPanel) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentPanel(response.showPanel);
      setCurrentHighlight(response.highlight);
    }

    // Show CTA if specified
    if (response.showCTA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowCTA(true);
      setCurrentPanel(null);
    }

    // Handle follow-up
    if (response.followUp) {
      await new Promise((resolve) => setTimeout(resolve, response.followUp.delay));
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessages((prev) => [...prev, { type: "bot", content: response.followUp!.message }]);
      setIsTyping(false);
      setCurrentPrompts(response.followUp.nextPrompts);
    }
  }, [currentPrompts]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setConversationStarted(true);
    setMessages((prev) => [...prev, { type: "user", content: inputValue }]);
    setInputValue("");

    // Default response for free-text input
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I'd love to dig into that. To give you the most relevant answer, let me ask: what's the primary thing keeping you up at night about your finances?",
        },
      ]);
      setIsTyping(false);
      setCurrentPrompts(conversationFlows.initial.prompts);
    }, 1000);
  };

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

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Conversation Panel */}
      <div
        className={cn(
          "flex flex-col h-screen transition-all duration-500 border-r border-white/[0.06]",
          currentPanel ? "w-[45%]" : "w-full"
        )}
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-white/[0.06] flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-white/30 uppercase tracking-widest hover:text-white/50 transition-colors"
            >
              THE CFO LINE
            </Link>
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
          {!conversationStarted && calendlyUrl && (
            <button
              onClick={handleCalendlyClick}
              className="text-xs text-white/30 hover:text-amber-500 transition-colors flex items-center gap-2"
            >
              Or just schedule a call
              <Calendar className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-8 py-8 flex flex-col",
            conversationStarted ? "justify-start" : "justify-center"
          )}
        >
          {!conversationStarted && (
            <div className="text-center mb-8">
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-medium text-white/90 tracking-tight leading-tight">
                What's keeping you up
                <br />
                <span className="italic text-white/60">about your numbers?</span>
              </h1>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "mb-4 flex animate-in fade-in duration-300",
                message.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] text-[15px] leading-relaxed",
                  message.type === "user"
                    ? "bg-white/[0.08] rounded-2xl rounded-br-sm px-4 py-3 text-white/90"
                    : "text-white/80"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-1 py-2 animate-in fade-in duration-300">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/40 animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}

          {showCTA && (
            <div className="mt-4">
              <DemoCTAPanel sessionId={sessionId || undefined} calendlyUrl={calendlyUrl || undefined} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompts */}
        {currentPrompts.length > 0 && !isTyping && (
          <div
            className={cn(
              "px-8 pb-4 flex gap-2 flex-wrap",
              conversationStarted ? "justify-start" : "justify-center"
            )}
          >
            {currentPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptClick(prompt.id)}
                className="bg-transparent border border-white/[0.12] text-white/60 px-4 py-2.5 rounded-full text-[13px] hover:border-amber-500/50 hover:text-amber-500 transition-all"
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-8 pb-8 pt-4">
          <form onSubmit={handleInputSubmit}>
            <div className="flex gap-3 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-1">
              <input
                type="text"
                placeholder="Tell me what's going on..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent border-none text-[15px] text-white placeholder:text-white/30 outline-none py-3"
              />
              <button
                type="submit"
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all my-auto",
                  inputValue
                    ? "bg-amber-500 text-black"
                    : "bg-white/10 text-white/30 cursor-default"
                )}
                disabled={!inputValue}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dashboard Panel */}
      {currentPanel && (
        <div className="w-[55%] h-screen overflow-y-auto p-6 bg-black/30 animate-in slide-in-from-right duration-500">
          <div className="mb-5 flex justify-between items-center">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                Demo: Glow Aesthetics
              </div>
              <div className="text-[13px] text-white/50">2 locations · $3.88M TTM</div>
            </div>
            <div className="text-[11px] text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
              Sample data
            </div>
          </div>

          {currentPanel === "cashflow" && <CashFlowPanel highlight={currentHighlight} />}
          {currentPanel === "pnl" && <PnLPanel highlight={currentHighlight} />}
          {currentPanel === "ar" && <ARPanel highlight={currentHighlight} />}
          {currentPanel === "providers" && <ProvidersPanel highlight={currentHighlight} />}
        </div>
      )}
    </div>
  );
}
