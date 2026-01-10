"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  DollarSign,
  Users,
  TrendingUp,
  FileText,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { aiCfoApi, AICfoMessage } from "@/lib/services/apiService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  financialSnapshot?: {
    cashBalance: number;
    runwayMonths: number;
    mtdProfitLoss: number;
    dataAsOf: string;
  };
}

const suggestedQuestions = [
  {
    icon: DollarSign,
    label: "Hiring Decision",
    question: "Can I afford to hire 2 engineers at $150K each?",
  },
  {
    icon: Users,
    label: "Collections",
    question: "Which customers should I chase for collections this week?",
  },
  {
    icon: TrendingUp,
    label: "Scenario",
    question: "What happens to my runway if revenue drops 20%?",
  },
  {
    icon: FileText,
    label: "Expenses",
    question: "Why did expenses spike last month?",
  },
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function AICfoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const auth = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (questionOverride?: string) => {
    const question = questionOverride || input.trim();
    if (!question || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory: AICfoMessage[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await aiCfoApi.askQuestion(
        question,
        conversationHistory,
        auth.token || undefined
      );

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.answer,
          timestamp: new Date(),
          financialSnapshot: response.data.financialSnapshot,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Failed to get response from AI CFO");
      }
    } catch (err: unknown) {
      console.error("AI CFO error:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to get response from AI CFO",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error processing your question. Please try again or rephrase your question.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleWeeklySummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await aiCfoApi.getWeeklySummary(auth.token || undefined);

      if (response.success && response.data) {
        const summaryMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.data.answer,
          timestamp: new Date(),
          financialSnapshot: response.data.financialSnapshot,
        };
        setMessages((prev) => [...prev, summaryMessage]);
      } else {
        throw new Error("Failed to generate weekly summary");
      }
    } catch (err: unknown) {
      console.error("Weekly summary error:", err);
      toast({
        title: "Error",
        description: "Failed to generate weekly summary",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">
          Please log in to use AI CFO Assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI CFO Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask questions about your finances in plain English
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleWeeklySummary}
          disabled={isGeneratingSummary}
        >
          {isGeneratingSummary ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          Weekly Summary
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 mb-4">
                <Sparkles className="h-8 w-8 text-violet-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome to AI CFO Assistant
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                I can help you understand your finances, analyze decisions, and
                provide CFO-level insights based on your QuickBooks data.
              </p>

              {/* Suggested Questions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestedQuestions.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start text-left"
                    onClick={() => handleSubmit(item.question)}
                    disabled={isLoading}
                  >
                    <item.icon className="h-4 w-4 mr-2 flex-shrink-0 text-violet-500" />
                    <span className="text-sm">{item.question}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-2"
                        : "space-y-2"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="text-sm">{message.content}</p>
                    ) : (
                      <>
                        <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                          <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert">
                            {message.content}
                          </div>
                        </div>

                        {message.financialSnapshot && (
                          <div className="flex flex-wrap gap-2 px-1">
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              Cash:{" "}
                              {formatCurrency(
                                message.financialSnapshot.cashBalance
                              )}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Runway:{" "}
                              {message.financialSnapshot.runwayMonths.toFixed(
                                1
                              )}{" "}
                              mo
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              MTD P/L:{" "}
                              {formatCurrency(
                                message.financialSnapshot.mtdProfitLoss
                              )}
                            </Badge>
                          </div>
                        )}
                      </>
                    )}

                    <p
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-primary-foreground/70 text-right"
                          : "text-muted-foreground px-1"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Analyzing your financial data...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your finances... (e.g., 'Can I afford to hire another developer?')"
              className="flex-1 min-h-[44px] max-h-32 px-4 py-2 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-11 w-11 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by Claude AI with your real-time QuickBooks data
          </p>
        </div>
      </Card>
    </div>
  );
}
