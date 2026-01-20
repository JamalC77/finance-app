import { PanelType, HighlightType } from './demoData';

export interface Prompt {
  id: string;
  label: string;
}

export interface FollowUp {
  delay: number;
  message: string;
  nextPrompts: Prompt[];
}

export interface Response {
  messages: string[];
  showPanel: PanelType;
  highlight: HighlightType;
  showCTA?: boolean;
  followUp: FollowUp | null;
}

export const conversationFlows = {
  initial: {
    prompts: [
      { id: 'cash', label: "Cash is always tight" },
      { id: 'trust', label: "I don't trust my numbers" },
      { id: 'profitable', label: "Not sure we're profitable" },
    ] as Prompt[]
  },
  responses: {
    cash: {
      messages: [
        "Cash flow gaps are incredibly common, especially in service businesses with any lag between delivery and collection.",
        "Let me show you what this typically looks like..."
      ],
      showPanel: 'cashflow' as PanelType,
      highlight: 'janfeb' as HighlightType,
      followUp: {
        delay: 2000,
        message: "See that dip in January-February? That's the cash conversion lag becoming visible. Revenue was strong in November-December, but collections don't catch up until spring.",
        nextPrompts: [
          { id: 'cash_deep', label: "That looks familiar" },
          { id: 'cash_different', label: "Ours is different" },
          { id: 'quantify', label: "What's that actually costing?" },
        ]
      }
    },
    trust: {
      messages: [
        "That feeling usually comes from one of two places: the books are actually messy, or they're clean but you don't have visibility into what matters.",
        "Here's what good visibility looks like..."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'metrics' as HighlightType,
      followUp: {
        delay: 2000,
        message: "Four numbers that tell you if you're healthy: revenue trend, gross margin, net margin, and growth rate. If you can't see these clearly, that's the trust gap.",
        nextPrompts: [
          { id: 'trust_messy', label: "Our books are messy" },
          { id: 'trust_visibility', label: "We need better visibility" },
          { id: 'trust_both', label: "Probably both" },
        ]
      }
    },
    profitable: {
      messages: [
        "That uncertainty usually means margin is getting lost somewhere between gross and net. Let me show you where to look..."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'margin' as HighlightType,
      followUp: {
        delay: 1500,
        message: "The gap between your gross margin and net margin tells the story. This med spa is keeping 24.8% - but watch how different service lines perform.",
        nextPrompts: [
          { id: 'services', label: "Show me by service" },
          { id: 'providers', label: "What about by provider?" },
          { id: 'industry', label: "How do we compare?" },
        ]
      }
    },
    cash_deep: {
      messages: [
        "Most businesses experience this. The question is whether you're planning for it or getting surprised by it every year."
      ],
      showPanel: 'cashflow' as PanelType,
      highlight: 'conversion' as HighlightType,
      followUp: {
        delay: 1500,
        message: "This business has a 47-day cash conversion cycle vs a 35-day target. That 12-day gap means roughly $52K trapped in working capital that could be deployed elsewhere.",
        nextPrompts: [
          { id: 'fix_cash', label: "How do you fix that?" },
          { id: 'ar_problem', label: "Is it an AR problem?" },
        ]
      }
    },
    quantify: {
      messages: [
        "Good question. Let's do the math on this example..."
      ],
      showPanel: 'cashflow' as PanelType,
      highlight: 'conversion' as HighlightType,
      followUp: {
        delay: 1500,
        message: "47-day cash conversion vs 35-day target = 12 days of revenue trapped. At $392K/month, that's roughly $52K in working capital that could be earning returns or covering gaps. Over a year, the opportunity cost adds up.",
        nextPrompts: [
          { id: 'fix_cash', label: "How would you fix it?" },
          { id: 'calculate_mine', label: "Can you calculate ours?" },
        ]
      }
    },
    fix_cash: {
      messages: [
        "Three levers: speed up collections, slow down payables strategically, or smooth revenue with memberships/packages.",
        "For this business, the AR aging tells us where to focus..."
      ],
      showPanel: 'ar' as PanelType,
      highlight: 'aging' as HighlightType,
      followUp: {
        delay: 2000,
        message: "$26K sitting in 30+ day receivables, mostly insurance. Tightening claim submission from 5 days to 48 hours could move $35K annually back into working capital.",
        nextPrompts: [
          { id: 'cta', label: "What would this look like for us?" },
          { id: 'providers', label: "What else should we look at?" },
        ]
      }
    },
    ar_problem: {
      messages: [
        "Often, yes. Let me show you what AR typically looks like..."
      ],
      showPanel: 'ar' as PanelType,
      highlight: 'aging' as HighlightType,
      followUp: {
        delay: 1500,
        message: "21% of this AR is past 30 days. For a med spa doing insurance billing, that's actually not terrible - but that $26K could be collected faster with tighter processes.",
        nextPrompts: [
          { id: 'fix_cash', label: "How do you speed that up?" },
          { id: 'cta', label: "Can you analyze ours?" },
        ]
      }
    },
    services: {
      messages: [
        "Service mix is where margin hides or gets found. Here's the breakdown..."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'services' as HighlightType,
      followUp: {
        delay: 1500,
        message: "Injectables at 64% margin vs Retail at 42%. Every point of mix shift toward high-margin services drops straight to the bottom line. What's your highest-margin service?",
        nextPrompts: [
          { id: 'providers', label: "Show me by provider" },
          { id: 'cta', label: "Analyze our mix" },
        ]
      }
    },
    providers: {
      messages: [
        "Provider economics are usually the biggest lever in a service business. Let me show you why..."
      ],
      showPanel: 'providers' as PanelType,
      highlight: 'utilization' as HighlightType,
      followUp: {
        delay: 2000,
        message: "See Dr. Park at 45% utilization? That's expensive unused capacity. Moving him to 70% would add $67K annually without adding a dollar of fixed cost.",
        nextPrompts: [
          { id: 'cta', label: "What's our provider gap?" },
          { id: 'fix_utilization', label: "How do you fix utilization?" },
        ]
      }
    },
    fix_utilization: {
      messages: [
        "Usually it's one of three things: scheduling inefficiency, marketing misalignment, or wrong role fit.",
        "The data tells you which. For Dr. Park, his avg ticket is strong ($500) but sessions are low - that points to demand, not performance."
      ],
      showPanel: 'providers' as PanelType,
      highlight: 'drpark' as HighlightType,
      followUp: {
        delay: 2000,
        message: "So the fix is either marketing his specific services harder, or reconsidering whether part-time MD is the right model for this practice.",
        nextPrompts: [
          { id: 'cta', label: "Diagnose our team" },
        ]
      }
    },
    trust_messy: {
      messages: [
        "Messy books are fixable. Usually takes 2-4 weeks to clean up and get to a baseline you can trust.",
        "The real question is: once they're clean, are you seeing what actually matters?"
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'metrics' as HighlightType,
      followUp: {
        delay: 1500,
        message: "Clean books + clear dashboards = decisions made with confidence instead of gut feel.",
        nextPrompts: [
          { id: 'cta', label: "Help us get there" },
          { id: 'cash', label: "What about cash flow?" },
        ]
      }
    },
    trust_visibility: {
      messages: [
        "That's actually the easier problem. Your accountant handles compliance; you need someone focused on insight.",
        "Here's the difference..."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'metrics' as HighlightType,
      followUp: {
        delay: 1500,
        message: "These four metrics, updated monthly, answer 80% of the questions a business owner actually has. Are you seeing these?",
        nextPrompts: [
          { id: 'cta', label: "Build this for us" },
          { id: 'providers', label: "What about team performance?" },
        ]
      }
    },
    trust_both: {
      messages: [
        "That's more common than you'd think. The good news: fixing one usually helps the other.",
        "Clean books make visibility possible. Visibility makes the cleanup feel worth it."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'metrics' as HighlightType,
      followUp: {
        delay: 1500,
        message: "We typically start with a diagnostic to see exactly where things stand, then build from there.",
        nextPrompts: [
          { id: 'cta', label: "What does that look like?" },
        ]
      }
    },
    industry: {
      messages: [
        "Med spas typically run 20-28% net margin depending on service mix and payer composition.",
        "This example at 24.8% is healthy but has room to optimize..."
      ],
      showPanel: 'pnl' as PanelType,
      highlight: 'margin' as HighlightType,
      followUp: {
        delay: 1500,
        message: "The question is always: where's your margin relative to your potential? That requires looking at your specific numbers.",
        nextPrompts: [
          { id: 'cta', label: "Benchmark our margins" },
          { id: 'providers', label: "Show provider performance" },
        ]
      }
    },
    calculate_mine: {
      messages: [
        "I'd need to see your actual AR aging and monthly collections pattern to calculate it precisely.",
        "That's exactly what our Financial Diagnostic does - maps your cash conversion cycle and quantifies the gap."
      ],
      showPanel: 'cashflow' as PanelType,
      highlight: 'conversion' as HighlightType,
      followUp: {
        delay: 1500,
        message: "Takes about 5-7 business days once we have access to your books. Want to set that up?",
        nextPrompts: [
          { id: 'cta', label: "Yes, let's do it" },
        ]
      }
    },
    cash_different: {
      messages: [
        "Every business has its own rhythm. What does yours look like - consistent gaps, or unpredictable swings?"
      ],
      showPanel: 'cashflow' as PanelType,
      highlight: 'janfeb' as HighlightType,
      followUp: {
        delay: 1500,
        message: "The pattern tells us where to focus. Consistent gaps usually mean structural AR issues. Swings often point to revenue concentration or seasonal exposure.",
        nextPrompts: [
          { id: 'cta', label: "Help us diagnose it" },
          { id: 'ar_problem', label: "Could be an AR issue" },
        ]
      }
    },
    cta: {
      messages: [
        "Our Financial Diagnostic builds exactly this view from your actuals - P&L trends, cash flow patterns, AR aging, and if relevant, provider performance.",
        "Takes 5-7 business days. You get a full report plus a 60-minute walkthrough of findings and recommendations."
      ],
      showPanel: null,
      highlight: null,
      showCTA: true,
      followUp: null
    }
  } as Record<string, Response>
};
