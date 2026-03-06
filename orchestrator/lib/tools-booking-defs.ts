import type Anthropic from "@anthropic-ai/sdk";

// ── Booking Tool Definitions for Claude Orchestrator ──
// These are the Anthropic-format tool definitions that get passed
// to Claude in the orchestrator's TOOLS array.

export const BOOKING_TOOLS: Anthropic.Tool[] = [
  {
    name: "initiate_booking",
    description:
      "Start a booking session when the member expresses interest in booking travel. Capture their preferences from the conversation — travel type, destination, dates, number of travelers, budget, and any special requests. This creates a tracked session for the full booking flow.",
    input_schema: {
      type: "object" as const,
      properties: {
        memberName: {
          type: "string",
          description: "Full name of the member as stated in conversation",
        },
        memberId: {
          type: "string",
          description:
            "Loyalty or membership ID if the member provided it (optional)",
        },
        travelType: {
          type: "string",
          enum: ["cruise", "hotel", "flight", "vacation_package", "car_rental"],
          description: "Type of travel the member is interested in",
        },
        destination: {
          type: "string",
          description:
            "Desired destination (e.g., 'Caribbean', 'Alaska', 'Cancun')",
        },
        departureWindow: {
          type: "string",
          description:
            "Preferred travel dates or window (e.g., 'March 2026', 'spring break')",
        },
        travelers: {
          type: "number",
          description: "Number of travelers (default 2)",
        },
        budgetRange: {
          type: "string",
          description:
            "Budget preference if mentioned (e.g., 'under $3000', 'luxury')",
        },
        specialRequests: {
          type: "string",
          description:
            "Any special requests (e.g., 'balcony cabin', 'ocean view', 'all-inclusive')",
        },
      },
      required: ["memberName", "travelType"],
    },
  },
  {
    name: "search_inventory",
    description:
      "Search for available travel packages matching the member's preferences. Call this after initiate_booking to find options. Present the results to the member conversationally — describe the top 2-3 options with pricing, highlights, and availability.",
    input_schema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "Booking session ID returned by initiate_booking",
        },
        filters: {
          type: "object",
          description: "Search filters derived from the conversation",
          properties: {
            travelType: {
              type: "string",
              enum: [
                "cruise",
                "hotel",
                "flight",
                "vacation_package",
                "car_rental",
              ],
            },
            destination: { type: "string" },
            departureAfter: {
              type: "string",
              description: "ISO 8601 date (earliest departure)",
            },
            departureBefore: {
              type: "string",
              description: "ISO 8601 date (latest departure)",
            },
            maxPrice: { type: "number" },
            minPrice: { type: "number" },
            travelers: { type: "number" },
            cabinClass: {
              type: "string",
              enum: ["inside", "ocean_view", "balcony", "suite", "any"],
              description: "Cruise cabin class preference",
            },
            starRating: {
              type: "number",
              description: "Hotel star rating (1-5)",
            },
          },
          required: ["travelType"],
        },
        page: {
          type: "number",
          description: "Page number for pagination (default 1)",
        },
        pageSize: {
          type: "number",
          description: "Results per page (default 5, max 10)",
        },
      },
      required: ["sessionId", "filters"],
    },
  },
  {
    name: "select_package",
    description:
      "Lock in the member's selected package after they've chosen one from the search results. IMPORTANT: Only call this after the member has verbally confirmed their choice. Repeat the package details and get explicit 'yes' before calling.",
    input_schema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "Booking session ID",
        },
        packageId: {
          type: "string",
          description: "ID of the selected inventory package",
        },
        packageSummary: {
          type: "string",
          description:
            "Human-readable summary you read to the member (e.g., '7-Night Western Caribbean Cruise, ocean view cabin, $1,299 per person')",
        },
        memberConfirmed: {
          type: "boolean",
          description:
            "Must be true — the member explicitly confirmed this selection",
        },
      },
      required: ["sessionId", "packageId", "packageSummary", "memberConfirmed"],
    },
  },
  {
    name: "generate_purl",
    description:
      "Generate a Personalized URL (booking link) that pre-fills the member's information and selected package into the booking portal. Ask the member how they'd like to receive it: text message, email, or displayed on screen. The link is valid for 2 hours.",
    input_schema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "Booking session ID",
        },
        deliveryMethod: {
          type: "string",
          enum: ["sms", "email", "display", "all"],
          description:
            "How to deliver the link: 'sms' for text message, 'email' for email, 'display' to show on screen, 'all' for all methods",
        },
        memberEmail: {
          type: "string",
          description: "Member email (required for email delivery)",
        },
        memberPhone: {
          type: "string",
          description: "Member phone in E.164 format (required for SMS delivery)",
        },
      },
      required: ["sessionId", "deliveryMethod"],
    },
  },
  {
    name: "booking_status",
    description:
      "Check the current status of a booking session. Use when the member asks about their booking progress, or to verify the state before taking the next step.",
    input_schema: {
      type: "object" as const,
      properties: {
        sessionId: {
          type: "string",
          description: "Booking session ID to check",
        },
      },
      required: ["sessionId"],
    },
  },
];
