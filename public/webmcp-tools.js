/**
 * Voxaris WebMCP Tool Registration
 *
 * Exposes structured tools for AI agents via the WebMCP protocol.
 * Works with:
 *   - Chrome 146+ (native navigator.modelContext via --enable-features=WebMcpTesting)
 *   - Any browser via @mcp-b/global polyfill (loaded in index.html)
 *   - External LLMs via @mcp-b/chrome-devtools-mcp CDP bridge
 *
 * Return format: MCP-style { content: [{ type: "text", text: "..." }] }
 *
 * Tools registered:
 *   navigate_to_page   — Navigate to any page on voxaris.io
 *   book_demo           — Submit a demo booking request
 *   get_solution_info   — Get details about a specific Voxaris solution
 *   get_site_overview   — Get a structured overview of Voxaris and its products
 *   scroll_to_section   — Scroll to a named section on the current page
 *   highlight_feature   — Highlight a feature card with a glow effect
 */

(function () {
  // Wait for modelContext (native or polyfill)
  function init() {
    if (!navigator.modelContext || typeof navigator.modelContext.registerTool !== 'function') {
      console.log('[WebMCP] navigator.modelContext not available — skipping tool registration');
      return;
    }

    var mc = navigator.modelContext;

    // Helper: MCP-style success response
    function ok(text) {
      return { content: [{ type: 'text', text: typeof text === 'string' ? text : JSON.stringify(text) }] };
    }

    // Helper: MCP-style error response
    function err(text) {
      return { content: [{ type: 'text', text: text }], isError: true };
    }

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
      execute: async function (input) {
        var page = input.page;
        var path = page.startsWith('/') ? page : '/' + page;
        window.location.href = path;
        return ok({ success: true, navigated_to: path });
      }
    });

    // ─── Tool 2: Book a Demo ────────────────────────────────────────────
    mc.registerTool({
      name: 'book_demo',
      description: 'Submit a demo booking request for Voxaris. Collects visitor information and sends a demo request. Use this when a visitor wants to schedule a personalized demo or get in touch with the Voxaris team.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Visitor full name' },
          phone: { type: 'string', description: 'Visitor phone number' },
          company: { type: 'string', description: 'Company or business name' },
          locations: { type: 'string', description: 'Number of locations (optional)' },
          message: { type: 'string', description: 'Additional message or specific interests (optional)' }
        },
        required: ['name', 'phone', 'company']
      },
      annotations: { readOnlyHint: false, destructiveHint: false },
      execute: async function (input, client) {
        // Request user interaction for demo booking (human-in-the-loop)
        if (client && client.requestUserInteraction) {
          try {
            await client.requestUserInteraction(function () {
              return Promise.resolve(); // Browser prompts user consent
            });
          } catch (e) {
            return err('User declined the demo booking request.');
          }
        }

        // Navigate to book-demo page first if not already there
        if (!window.location.pathname.includes('book-demo')) {
          window.location.href = '/book-demo';
          await new Promise(function (resolve) { setTimeout(resolve, 1500); });
        }

        // Fill the form via React-friendly input events
        var fillInput = function (name, value) {
          if (!value) return;
          var el = document.querySelector('input[name="' + name + '"], textarea[name="' + name + '"], select[name="' + name + '"]');
          if (el) {
            var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
            if (setter && setter.set) {
              setter.set.call(el, value);
            } else {
              el.value = value;
            }
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        fillInput('name', input.name);
        fillInput('phone', input.phone);
        fillInput('company', input.company);
        fillInput('locations', input.locations || '');
        fillInput('message', input.message || '');

        var form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        }

        return ok({
          success: true,
          message: 'Demo request submitted for ' + input.name + ' at ' + input.company + '. Ethan will reach out same business day.'
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
      annotations: { readOnlyHint: true },
      execute: async function (input) {
        var solutions = {
          dealerships: {
            name: 'V\u00b7TEAMS for Car Dealerships',
            tagline: 'A full AI team that never clocks out',
            products: ['V\u00b7TEAMS (multi-agent AI squad)', 'Receptionist \u2192 Qualifier \u2192 Specialist \u2192 Closer'],
            features: [
              'AI receptionist answers every call 24/7 with warm, natural conversation',
              'Qualifier agent gathers needs, budget, timeline \u2014 no lead left unscreened',
              'Specialist agent handles deep product questions with dealership knowledge',
              'Closer agent books appointments and confirms with the customer',
              'Warm transfers with full context between every agent \u2014 no caller repeats themselves',
              'CRM integration with DealerSocket, VinSolutions, etc.'
            ],
            ideal_for: 'Dealerships losing leads after hours, slow BDC response, high staff turnover',
            differentiator: 'Not one bot \u2014 a coordinated AI team that handles the full call lifecycle'
          },
          hospitality: {
            name: 'V\u00b7TEAMS for Hotels & Resorts',
            tagline: 'AI concierge team that books direct',
            products: ['V\u00b7TEAMS (multi-agent AI squad)', 'Receptionist \u2192 Booking Specialist \u2192 Concierge'],
            features: [
              'AI receptionist handles every inbound call with brand-matched warmth',
              'Booking specialist checks availability and processes direct reservations',
              'Concierge agent answers amenity, dining, and activity questions',
              'Multilingual support for international guests',
              'Reduces OTA dependency by converting direct phone and web traffic'
            ],
            ideal_for: 'Hotels losing direct bookings to OTAs, understaffed front desk',
            differentiator: 'A full AI front-desk team \u2014 not a single chatbot'
          },
          contractors: {
            name: 'V\u00b7TEAMS for Contractors',
            tagline: 'Never miss another call',
            products: ['V\u00b7TEAMS (multi-agent AI squad)', 'Receptionist \u2192 Qualifier \u2192 Scheduler'],
            features: [
              'AI receptionist answers every call \u2014 nights, weekends, holidays',
              'Qualifier agent screens by service type, urgency, location',
              'Scheduler agent books jobs directly into your calendar',
              'Sends instant text confirmations to homeowners',
              'Missed call text-back with AI follow-up'
            ],
            ideal_for: 'Plumbers, HVAC, roofers, electricians losing jobs to missed calls',
            differentiator: 'Built specifically for trades \u2014 a team that understands service urgency'
          },
          'direct-mail': {
            name: 'Talking Postcards',
            tagline: 'Physical mail meets AI conversation',
            products: ['Talking Postcards (QR \u2192 AI call)', 'V\u00b7TEAMS (postcard response squad)'],
            features: [
              'Physical postcards with QR codes that launch AI phone conversations',
              'AI receptionist greets each recipient by name',
              'Qualifier agent screens the lead and books appointments on the spot',
              '8-30% engagement rate vs 1-2% traditional direct mail',
              'Full analytics \u2014 scan rates, conversation metrics, bookings'
            ],
            ideal_for: 'Any business using direct mail that wants dramatically higher response rates',
            differentiator: 'Only AI-powered direct mail product with real multi-agent phone conversations'
          },
          'white-label': {
            name: 'White Label V\u00b7TEAMS',
            tagline: 'Resell Voxaris under your brand',
            products: ['Full V\u00b7TEAMS platform white-labeled', 'Partner dashboard', 'Custom branding'],
            features: [
              'Deploy V\u00b7TEAMS multi-agent squads under your brand',
              'Partner portal for managing client deployments',
              'Up to 70% margins on resold services',
              'White-glove onboarding and technical support',
              'Custom agent personas and branding per client'
            ],
            ideal_for: 'Marketing agencies, SaaS resellers, BPO companies',
            differentiator: 'Only white-label platform with coordinated multi-agent AI voice teams'
          }
        };

        var data = solutions[input.solution];
        if (!data) return err('Unknown solution: ' + input.solution);
        return ok(data);
      }
    });

    // ─── Tool 4: Get Site Overview ──────────────────────────────────────
    mc.registerTool({
      name: 'get_site_overview',
      description: 'Get a structured overview of Voxaris, its products, and capabilities. Use this to answer general questions about what Voxaris does, its product suite, or to orient a visitor.',
      inputSchema: { type: 'object', properties: {}, required: [] },
      annotations: { readOnlyHint: true },
      execute: async function () {
        return ok({
          company: 'Voxaris',
          tagline: 'AI Teams That Answer, Qualify & Close \u2014 24/7',
          description: 'Voxaris builds V\u00b7TEAMS \u2014 coordinated squads of AI voice agents that handle inbound and outbound calls end-to-end. A receptionist answers, a qualifier screens, a specialist handles deep questions, and a closer books the appointment. Every transfer is warm with full context passed seamlessly.',
          platform: 'VoxEngine',
          products: {
            'V\u00b7TEAMS': 'Multi-agent AI voice squads with warm transfers. Receptionist \u2192 Qualifier \u2192 Specialist \u2192 Closer working together on every call.',
            'Talking Postcards': 'Physical postcards with QR codes that launch AI phone conversations. 8-30% engagement vs 1-2% industry standard.'
          },
          industries: ['Car Dealerships', 'Hotels & Resorts', 'Home Services/Contractors', 'Direct Mail', 'White Label/Agencies'],
          cta: 'Book a demo at /book-demo to see V\u00b7TEAMS handle a live call.',
          phone: '(407) 759-4100 \u2014 call now to talk to our AI agent',
          website: 'https://voxaris.io'
        });
      }
    });

    // ─── Tool 5: Scroll to Section ──────────────────────────────────────
    mc.registerTool({
      name: 'scroll_to_section',
      description: 'Scroll the page to a specific section. Use this when the visitor asks to see a particular part of the website.',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: ['hero', 'features', 'how-it-works', 'solutions', 'technology', 'pricing', 'demo', 'contact', 'vface', 'vvoice', 'vsuite', 'talking-postcard'],
            description: 'The section to scroll to'
          }
        },
        required: ['section']
      },
      execute: async function (input) {
        var selectors = [
          '#' + input.section,
          '[data-section="' + input.section + '"]',
          '#section-' + input.section,
          '[id*="' + input.section + '"]'
        ];
        for (var i = 0; i < selectors.length; i++) {
          var el = document.querySelector(selectors[i]);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('vox-highlight');
            setTimeout(function () { el.classList.remove('vox-highlight'); }, 2500);
            return ok({ scrolled_to: input.section, found: true });
          }
        }
        return ok({ scrolled_to: input.section, found: false, message: 'Section not found on current page' });
      }
    });

    // ─── Tool 6: Highlight Feature ──────────────────────────────────────
    mc.registerTool({
      name: 'highlight_feature',
      description: 'Visually highlight a feature card or element on the page with a glow effect. Use this to draw attention to a specific feature while explaining it.',
      inputSchema: {
        type: 'object',
        properties: {
          feature: {
            type: 'string',
            description: 'Which feature to highlight (e.g. V\u00b7FACE, V\u00b7VOICE, 24/7 availability)'
          }
        },
        required: ['feature']
      },
      execute: async function (input) {
        var target = document.querySelector('[data-feature="' + input.feature + '"]');
        if (!target) {
          var featureLower = (input.feature || '').toLowerCase();
          var cards = document.querySelectorAll('[data-feature], [class*="card"]');
          for (var i = 0; i < cards.length; i++) {
            if (cards[i].textContent && cards[i].textContent.toLowerCase().indexOf(featureLower) !== -1) {
              target = cards[i];
              break;
            }
          }
        }
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.transition = 'all .4s ease-out';
          target.style.boxShadow = '0 0 40px rgba(148,163,184,.15), 0 0 0 2px rgba(148,163,184,.2)';
          target.style.transform = 'scale(1.02)';
          setTimeout(function () {
            target.style.boxShadow = '';
            target.style.transform = '';
          }, 3000);
          return ok({ highlighted: input.feature, found: true });
        }
        return ok({ highlighted: input.feature, found: false });
      }
    });

    console.log('[WebMCP] Voxaris tools registered: navigate_to_page, book_demo, get_solution_info, get_site_overview, scroll_to_section, highlight_feature');
  }

  // Run init — if polyfill hasn't loaded yet, wait for it
  if (navigator.modelContext) {
    init();
  } else {
    // The polyfill may load async; retry briefly
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (navigator.modelContext) {
        clearInterval(interval);
        init();
      } else if (attempts > 20) {
        clearInterval(interval);
        console.log('[WebMCP] navigator.modelContext not available after 2s — tools not registered');
      }
    }, 100);
  }
})();
