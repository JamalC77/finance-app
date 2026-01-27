"use client";

import { useState, useEffect } from "react";
import { ProspectHeader } from "./ProspectHeader";
import { ProspectIntelSection } from "./ProspectIntelSection";
import { ProspectEstimates } from "./ProspectEstimates";
import { ProspectChat } from "./ProspectChat";
import { ProspectCTA } from "./ProspectCTA";
import type { ProspectPublic } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ProspectLandingPageProps {
  prospect: ProspectPublic;
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

// Generate visitor ID for tracking
function getVisitorId(): string {
  if (typeof window === "undefined") return "";

  let visitorId = localStorage.getItem("cfoline_visitor_id");
  if (!visitorId) {
    visitorId = `v-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("cfoline_visitor_id", visitorId);
  }
  return visitorId;
}

export function ProspectLandingPage({ prospect }: ProspectLandingPageProps) {
  const [showCta, setShowCta] = useState(true);
  const [pageViewId, setPageViewId] = useState<string | null>(null);

  // Track page view on mount
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const utm = getUtmParams();
        const visitorId = getVisitorId();

        const response = await fetch(
          `${API_BASE}/api/public/prospect/${prospect.slug}/view`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitorId,
              utmSource: utm.source,
              utmCampaign: utm.campaign,
              utmMedium: utm.medium,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPageViewId(data.id);
        }
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();
  }, [prospect.slug]);

  // Handle CTA click tracking
  const handleCtaClick = async () => {
    try {
      await fetch(`${API_BASE}/api/public/prospect/${prospect.slug}/cta-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageViewId }),
      });
    } catch (error) {
      console.error("Failed to track CTA click:", error);
    }
  };

  // Handle when chat offers CTA
  const handleCtaOffered = () => {
    // Could show CTA panel more prominently, etc.
    setShowCta(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with personalized greeting */}
      <ProspectHeader
        ownerName={prospect.ownerName}
        companyName={prospect.companyName}
        location={prospect.location}
        industry={prospect.industry}
      />

      {/* Intel cards */}
      <ProspectIntelSection intelCards={prospect.intelCards} />

      {/* Pitch estimates section */}
      {prospect.pitch && (
        <ProspectEstimates pitch={prospect.pitch} />
      )}

      {/* Chat section */}
      <div className="flex-grow py-2">
        <ProspectChat
          prospectSlug={prospect.slug}
          painPoints={prospect.painPoints}
          onCtaOffered={handleCtaOffered}
        />
      </div>

      {/* CTA Panel */}
      <ProspectCTA
        headline={prospect.cta.headline}
        subhead={prospect.cta.subhead}
        buttonText={prospect.cta.buttonText}
        calendarLink={prospect.cta.calendarLink}
        onCtaClick={handleCtaClick}
        visible={showCta}
      />

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border/20">
        <div className="max-w-4xl mx-auto text-center text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
