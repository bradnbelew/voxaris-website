/**
 * Voxaris WebMCP Tool Registration
 * Exposes structured tools for AI agents via Chrome's WebMCP protocol (Chrome 146+)
 *
 * Tools registered:
 * - navigate_to_page: Navigate to any page on voxaris.io
 * - book_demo: Submit a demo booking request
 * - get_solution_info: Get details about a specific Voxaris solution
 * - get_site_overview: Get a structured overview of Voxaris and its products
 */

(function () {
  // Guard: only register if WebMCP is available
  if (!navigator.modelContext || typeof navigator.modelContext.registerTool !== 'function') {
    console.log('[WebMCP] navigator.modelContext not available — skipping tool registration');
    return;
  }

  const mc = navigator.modelContext;

  // ─── Tool 1: Navigate to Page ───────────────────────────────────────
  mc.registerTool({
    name: 'navigate_to_page',
    description: 'Navigate to a specific page on the Voxaris website. Use this to show visitors different solutions, the demo page, pricing, technology details, or any other page.',
    inputSchema: {
      type: 'object',
      properties: {
        page: {
          type: 'string',
          enum: [
            'home',
            'solutions/dealerships',
            'solutions/hospitality',
            'solutions/contractors',
            'solutions/direct-mail',
            'solutions/white-label',
            'technology',
            'demo',
            'book-demo',
            'how-it-works',
            'why-voxaris',
            'talking-postcard',
            'blog'
          ],
          description: 'The page path to navigate to'
        }
      },
      required: ['page']
    },
    execute: async ({ page }) => {
      const path = page.startsWith('/') ? page : '/' + page;
      window.location.href = path;
      return JSON.stringify({ success: true, navigated_to: path });
    }
  });

  // ─── Tool 2: Book a Demo ────────────────────────────────────────────
  mc.registerTool({
    name: 'book_demo',
    description: 'Submit a demo booking request for Voxaris. Collects visitor information and sends a demo request. Use this when a visitor wants to schedule a personalized demo or get in touch with the Voxaris team.',
    inputSchema: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          description: 'Visitor first name'
        },
        last_name: {
          type: 'string',
          description: 'Visitor last name'
        },
        email: {
          type: 'string',
          description: 'Visitor email address'
        },
        phone: {
          type: 'string',
          description: 'Visitor phone number (optional)'
        },
        company: {
          type: 'string',
          description: 'Company or business name (optional)'
        },
        business_type: {
          type: 'string',
          enum: ['dealership', 'hotel', 'contractor', 'agency', 'other'],
          description: 'Type of business'
        },
        message: {
          type: 'string',
          description: 'Additional message or specific interests (optional)'
        }
      },
      required: ['first_name', 'last_name', 'email', 'business_type']
    },
    execute: async ({ first_name, last_name, email, phone, company, business_type, message }) => {
      // Navigate to book-demo page first if not already there
      if (!window.location.pathname.includes('book-demo')) {
        window.location.href = '/book-demo';
        // Wait for SPA navigation
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Fill the form via React-friendly input events
      const fillInput = (name, value) => {
        if (!value) return;
        const input = document.querySelector(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`);
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, value);
          } else {
            input.value = value;
          }
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };

      fillInput('firstName', first_name);
      fillInput('lastName', last_name);
      fillInput('email', email);
      fillInput('phone', phone || '');
      fillInput('company', company || '');
      fillInput('businessType', business_type);
      fillInput('message', message || '');

      // Submit the form
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }

      return JSON.stringify({
        success: true,
        message: `Demo request submitted for ${first_name} ${last_name} (${email}). The Voxaris team will follow up within 24 hours.`
      });
    }
  });

  // ─── Tool 3: Get Solution Info ──────────────────────────────────────
  mc.registerTool({
    name: 'get_solution_info',
    description: 'Get detailed information about a specific Voxaris solution/vertical. Returns product details, features, and pricing context without needing to navigate away from the current page.',
    inputSchema: {
      type: 'object',
      properties: {
        solution: {
          type: 'string',
          enum: ['dealerships', 'hospitality', 'contractors', 'direct-mail', 'white-label'],
          description: 'The solution vertical to get info about'
        }
      },
      required: ['solution']
    },
    execute: async ({ solution }) => {
      const solutions = {
        dealerships: {
          name: 'V·GUIDE for Car Dealerships',
          tagline: 'AI BDC that never sleeps',
          products: ['V·GUIDE (video agent on website)', 'V·SENSE (inbound/outbound voice)', 'V·OUTBOUND (lead follow-up calls)'],
          features: [
            'Photorealistic AI video agent greets every website visitor',
            'Controls the dealership website — browses inventory, fills forms, books test drives',
            'Answers phone calls 24/7, qualifies leads, books appointments',
            'Outbound follow-up on missed leads and internet inquiries',
            'CRM integration with DealerSocket, VinSolutions, etc.'
          ],
          ideal_for: 'Dealerships losing leads after hours, slow BDC response, high staff turnover',
          differentiator: 'Podium/Kenect alternative with actual video presence and browser control'
        },
        hospitality: {
          name: 'V·GUIDE for Hotels & Resorts',
          tagline: 'AI concierge that books direct',
          products: ['V·GUIDE (website concierge)', 'V·SENSE (voice booking agent)'],
          features: [
            'Photorealistic AI concierge on hotel website',
            'Handles room inquiries, checks availability, processes direct bookings',
            'Multilingual support for international guests',
            'Answers common questions about amenities, dining, activities',
            'Reduces OTA dependency by converting direct website traffic'
          ],
          ideal_for: 'Hotels losing direct bookings to OTAs, understaffed front desk',
          differentiator: 'First AI concierge with a real face that controls the booking engine live'
        },
        contractors: {
          name: 'V·SENSE for Contractors',
          tagline: 'Never miss another call',
          products: ['V·SENSE (24/7 voice answering)', 'V·OUTBOUND (missed call recovery)'],
          features: [
            'AI answers every call — nights, weekends, holidays',
            'Qualifies leads by service type, urgency, location',
            'Books jobs directly into your calendar',
            'Sends instant text confirmations to homeowners',
            'Missed call text-back with AI follow-up'
          ],
          ideal_for: 'Plumbers, HVAC, roofers, electricians losing jobs to missed calls',
          differentiator: 'Built specifically for trades — understands service urgency and scheduling'
        },
        'direct-mail': {
          name: 'Talking Postcards',
          tagline: 'Physical mail meets AI video',
          products: ['Talking Postcards (QR → AI video)', 'V·GUIDE (postcard landing page agent)'],
          features: [
            'Physical postcards with QR codes that launch AI video conversations',
            'Personalized photorealistic video agent greets each recipient',
            'Agent qualifies the lead and books appointments on the spot',
            '8-30% engagement rate vs 1-2% traditional direct mail',
            'Full analytics — scan rates, conversation metrics, bookings'
          ],
          ideal_for: 'Any business using direct mail that wants dramatically higher response rates',
          differentiator: 'Only AI-powered direct mail product with real video conversations'
        },
        'white-label': {
          name: 'White Label AI Agents',
          tagline: 'Resell Voxaris under your brand',
          products: ['Full V·SUITE white-labeled', 'Partner dashboard', 'Custom branding'],
          features: [
            'Deploy V·GUIDE, V·SENSE, and Talking Postcards under your brand',
            'Partner portal for managing client deployments',
            'Up to 70% margins on resold services',
            'White-glove onboarding and technical support',
            'Custom agent personas and branding per client'
          ],
          ideal_for: 'Marketing agencies, SaaS resellers, BPO companies',
          differentiator: 'Only white-label platform with photorealistic video + voice + browser control'
        }
      };

      return JSON.stringify(solutions[solution] || { error: 'Unknown solution' });
    }
  });

  // ─── Tool 4: Get Site Overview ──────────────────────────────────────
  mc.registerTool({
    name: 'get_site_overview',
    description: 'Get a structured overview of Voxaris, its products, and capabilities. Use this to answer general questions about what Voxaris does, its product suite, or to orient a visitor.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    },
    execute: async () => {
      return JSON.stringify({
        company: 'Voxaris',
        tagline: 'Photorealistic AI Agents for Every Business',
        description: 'Voxaris builds AI agents that see, speak, and act. Our V·GUIDE agents appear as photorealistic video humans on websites, control the browser in real-time, and have natural conversations with visitors. V·SENSE handles voice calls 24/7.',
        platform: 'VoxEngine',
        platform_description: 'The AI engine powering all Voxaris agents — sub-1-second response, persistent memory (V·MEMORY), browser control (V·GUIDE), voice intelligence (V·SENSE).',
        products: {
          'V·GUIDE': 'Photorealistic AI video agent that appears on websites, has conversations, and controls the browser to navigate, fill forms, and book appointments.',
          'V·SENSE': 'AI voice agent for inbound and outbound phone calls. Answers 24/7, qualifies leads, books appointments, sends texts.',
          'V·OUTBOUND': 'AI-powered outbound calling for lead follow-up, appointment confirmations, and re-engagement campaigns.',
          'V·MEMORY': 'Persistent context system that remembers past interactions across channels for personalized follow-up.',
          'Talking Postcards': 'Physical postcards with QR codes that launch personalized AI video conversations. 8-30% engagement vs 1-2% industry standard.'
        },
        industries: ['Car Dealerships', 'Hotels & Resorts', 'Home Services/Contractors', 'Direct Mail', 'White Label/Agencies'],
        cta: 'Book a demo at /book-demo to see V·GUIDE in action.',
        website: 'https://voxaris.io'
      });
    }
  });

  console.log('[WebMCP] Voxaris tools registered: navigate_to_page, book_demo, get_solution_info, get_site_overview');
})();
