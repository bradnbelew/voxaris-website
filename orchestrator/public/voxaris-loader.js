/**
 * Voxaris Embed Loader — Tavus CVI Avatar + Navigation Bridge
 *
 * Self-demo on voxaris.io:
 * <script src="/orchestrator/voxaris-loader.js"
 *         data-persona-id="YOUR_PERSONA_ID"
 *         data-mode="self-demo"
 *         async></script>
 *
 * Hotel integration:
 * <script src="https://orchestrator.voxaris.io/voxaris-loader.js"
 *         data-hotel-id="UUID"
 *         data-embed-key="emb_xxxx"
 *         async></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  // ── Config ──
  var mode = script.getAttribute("data-mode") || "hotel";
  var personaId = script.getAttribute("data-persona-id") || "";
  var hotelId = script.getAttribute("data-hotel-id") || "";
  var embedKey = script.getAttribute("data-embed-key") || "";
  var position = script.getAttribute("data-position") || "bottom-right";
  var BASE_URL = script.getAttribute("data-api-base") || script.src.replace(/\/[^/]*$/, "");

  // ── Styles ──
  var css = document.createElement("style");
  css.textContent = [
    /* Trigger pill */
    ".vxr-trigger{position:fixed;bottom:24px;" +
      (position === "bottom-left" ? "left" : "right") +
      ":24px;z-index:99998;display:flex;align-items:center;gap:10px;padding:10px 18px 10px 10px;" +
      "border-radius:999px;border:1px solid rgba(212,168,67,.3);cursor:pointer;" +
      "background:linear-gradient(135deg,#0a0b0d 0%,#131519 100%);" +
      "box-shadow:0 4px 24px rgba(0,0,0,.5),0 0 0 1px rgba(212,168,67,.15);" +
      "transition:all .3s cubic-bezier(.4,0,.2,1);font-family:'DM Sans',system-ui,sans-serif}",
    ".vxr-trigger:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.6),0 0 20px rgba(212,168,67,.2)}",
    ".vxr-trigger-avatar{width:40px;height:40px;border-radius:50%;background:#1a1c20;" +
      "border:2px solid rgba(212,168,67,.4);overflow:hidden;flex-shrink:0;position:relative}",
    ".vxr-trigger-avatar::after{content:'';position:absolute;top:2px;right:2px;width:10px;height:10px;" +
      "border-radius:50%;background:#4ade80;border:2px solid #0a0b0d}",
    ".vxr-trigger-text{color:#e5e2d9;font-size:13px;font-weight:500;white-space:nowrap}",
    ".vxr-trigger-gold{color:#d4a843}",

    /* Video panel */
    ".vxr-panel{position:fixed;bottom:24px;" +
      (position === "bottom-left" ? "left" : "right") +
      ":24px;z-index:99999;width:380px;height:520px;" +
      "border-radius:20px;overflow:hidden;display:none;flex-direction:column;" +
      "background:#07080a;border:1px solid rgba(212,168,67,.2);" +
      "box-shadow:0 12px 48px rgba(0,0,0,.7),0 0 0 1px rgba(212,168,67,.1);" +
      "font-family:'DM Sans',system-ui,sans-serif;transition:all .3s}",
    ".vxr-panel.open{display:flex}",

    /* Panel header */
    ".vxr-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;" +
      "background:linear-gradient(135deg,#0f1114 0%,#151820 100%);" +
      "border-bottom:1px solid rgba(212,168,67,.15)}",
    ".vxr-header-left{display:flex;align-items:center;gap:8px}",
    ".vxr-live-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:vxr-pulse 2s infinite}",
    ".vxr-header-title{color:#e5e2d9;font-size:13px;font-weight:600;letter-spacing:.02em}",
    ".vxr-close{background:none;border:none;color:rgba(229,226,217,.5);cursor:pointer;padding:4px;" +
      "border-radius:6px;transition:all .2s;display:flex;align-items:center;justify-content:center}",
    ".vxr-close:hover{color:#e5e2d9;background:rgba(255,255,255,.08)}",

    /* Video container */
    ".vxr-video{flex:1;position:relative;background:#07080a;overflow:hidden}",
    ".vxr-video iframe{width:100%;height:100%;border:none}",
    ".vxr-video-placeholder{width:100%;height:100%;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;gap:12px;color:rgba(229,226,217,.4)}",
    ".vxr-video-placeholder svg{opacity:.5}",

    /* Caption bar */
    ".vxr-captions{padding:10px 16px;background:rgba(15,17,20,.95);border-top:1px solid rgba(212,168,67,.1);" +
      "min-height:42px;display:flex;align-items:center}",
    ".vxr-caption-text{color:rgba(229,226,217,.8);font-size:12px;line-height:1.5;max-height:36px;" +
      "overflow:hidden;transition:all .3s}",

    /* Footer */
    ".vxr-footer{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;" +
      "background:#07080a;border-top:1px solid rgba(255,255,255,.05)}",
    ".vxr-powered{font-size:9px;color:rgba(229,226,217,.25);letter-spacing:.05em;text-transform:uppercase}",
    ".vxr-mute{background:none;border:none;color:rgba(229,226,217,.4);cursor:pointer;padding:4px;" +
      "border-radius:6px;transition:all .2s;display:flex;align-items:center}",
    ".vxr-mute:hover{color:#e5e2d9;background:rgba(255,255,255,.08)}",

    /* Draggable */
    ".vxr-dragging{cursor:grabbing!important;user-select:none}",

    /* Animations */
    "@keyframes vxr-pulse{0%,100%{opacity:1}50%{opacity:.4}}",
    "@keyframes vxr-fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}",
    ".vxr-panel.open{animation:vxr-fadeIn .3s ease-out}",
  ].join("\n");
  document.head.appendChild(css);

  // ── State ──
  var isOpen = false;
  var conversationId = null;
  var isMuted = false;
  var lastCaption = "";
  var dragState = { dragging: false, offsetX: 0, offsetY: 0 };

  // ── Create trigger ──
  var trigger = document.createElement("button");
  trigger.className = "vxr-trigger";
  trigger.setAttribute("aria-label", "Talk to Voxaris AI");
  trigger.innerHTML =
    '<div class="vxr-trigger-avatar">' +
    '<svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#1a1c20"/>' +
    '<path d="M20 8C13.4 8 8 13.4 8 20s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm0 4a4 4 0 110 8 4 4 0 010-8zm0 17c-3.3 0-6.2-1.7-7.9-4.2.04-2.6 5.3-4 7.9-4s7.9 1.4 7.9 4A9.5 9.5 0 0120 29z" fill="#d4a843" opacity=".6"/></svg>' +
    "</div>" +
    '<span class="vxr-trigger-text">Talk to <span class="vxr-trigger-gold">Voxaris</span></span>';
  document.body.appendChild(trigger);

  // ── Create panel ──
  var panel = document.createElement("div");
  panel.className = "vxr-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Voxaris AI Video Agent");
  panel.innerHTML =
    '<div class="vxr-header">' +
    '<div class="vxr-header-left">' +
    '<div class="vxr-live-dot"></div>' +
    '<span class="vxr-header-title">Voxaris Agent</span>' +
    "</div>" +
    '<button class="vxr-close" id="vxr-close" aria-label="Close">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    "</button></div>" +
    '<div class="vxr-video" id="vxr-video">' +
    '<div class="vxr-video-placeholder" id="vxr-placeholder">' +
    '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg>' +
    '<span style="font-size:13px">Starting video agent...</span>' +
    "</div></div>" +
    '<div class="vxr-captions"><span class="vxr-caption-text" id="vxr-caption"></span></div>' +
    '<div class="vxr-footer">' +
    '<span class="vxr-powered">Powered by Voxaris</span>' +
    '<button class="vxr-mute" id="vxr-mute" aria-label="Mute">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>' +
    "</button></div>";
  document.body.appendChild(panel);

  // ── Event handlers ──
  trigger.addEventListener("click", function () {
    isOpen = true;
    panel.classList.add("open");
    trigger.style.display = "none";
    startConversation();
  });

  document.getElementById("vxr-close").addEventListener("click", function () {
    isOpen = false;
    panel.classList.remove("open");
    trigger.style.display = "flex";
    if (conversationId) endConversation();
  });

  document.getElementById("vxr-mute").addEventListener("click", function () {
    isMuted = !isMuted;
    var iframe = panel.querySelector("iframe");
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "voxaris:mute", muted: isMuted }, "*");
    }
    this.style.opacity = isMuted ? "0.3" : "1";
  });

  // ── Draggable panel ──
  var header = panel.querySelector(".vxr-header");
  header.style.cursor = "grab";

  header.addEventListener("mousedown", function (e) {
    if (e.target.closest(".vxr-close")) return;
    dragState.dragging = true;
    var rect = panel.getBoundingClientRect();
    dragState.offsetX = e.clientX - rect.left;
    dragState.offsetY = e.clientY - rect.top;
    panel.classList.add("vxr-dragging");
    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!dragState.dragging) return;
    var x = e.clientX - dragState.offsetX;
    var y = e.clientY - dragState.offsetY;
    // Clamp to viewport
    x = Math.max(0, Math.min(window.innerWidth - 380, x));
    y = Math.max(0, Math.min(window.innerHeight - 520, y));
    panel.style.left = x + "px";
    panel.style.top = y + "px";
    panel.style.right = "auto";
    panel.style.bottom = "auto";
  });

  document.addEventListener("mouseup", function () {
    if (dragState.dragging) {
      dragState.dragging = false;
      panel.classList.remove("vxr-dragging");
    }
  });

  // ── Tavus CVI Integration ──
  function startConversation() {
    var placeholder = document.getElementById("vxr-placeholder");
    if (placeholder) placeholder.querySelector("span").textContent = "Connecting...";

    // Create conversation via Tavus API
    var createUrl = BASE_URL + "/api/tavus/conversation";
    var body = mode === "self-demo"
      ? { persona_id: personaId, mode: "self-demo" }
      : { hotel_id: hotelId, embed_key: embedKey };

    fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to create conversation: " + res.status);
        return res.json();
      })
      .then(function (data) {
        conversationId = data.conversation_id;
        embedTavusVideo(data.conversation_url);
      })
      .catch(function (err) {
        console.error("[Voxaris] Conversation start failed:", err);
        if (placeholder) {
          placeholder.querySelector("span").textContent =
            "Connection failed. Click to retry.";
          placeholder.style.cursor = "pointer";
          placeholder.onclick = function () {
            placeholder.querySelector("span").textContent = "Reconnecting...";
            placeholder.style.cursor = "default";
            placeholder.onclick = null;
            startConversation();
          };
        }
      });
  }

  function embedTavusVideo(conversationUrl) {
    var container = document.getElementById("vxr-video");
    var placeholder = document.getElementById("vxr-placeholder");
    if (placeholder) placeholder.remove();

    var iframe = document.createElement("iframe");
    iframe.src = conversationUrl;
    iframe.allow = "camera;microphone;display-capture;autoplay";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    container.appendChild(iframe);
  }

  function endConversation() {
    if (!conversationId) return;

    fetch(BASE_URL + "/api/tavus/conversation/" + conversationId, {
      method: "DELETE",
    }).catch(function () {
      // Best-effort cleanup
    });

    // Remove iframe
    var iframe = panel.querySelector("iframe");
    if (iframe) iframe.remove();

    // Re-add placeholder
    var container = document.getElementById("vxr-video");
    var placeholder = document.createElement("div");
    placeholder.className = "vxr-video-placeholder";
    placeholder.id = "vxr-placeholder";
    placeholder.innerHTML =
      '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16"/></svg>' +
      "<span>Session ended</span>";
    container.appendChild(placeholder);

    conversationId = null;
  }

  // ── Navigation Bridge (postMessage) ──
  // Listens for tool execution results from the orchestrator
  // and performs DOM actions on the host page
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.source !== "voxaris-orchestrator") return;

    switch (data.action) {
      case "scroll_to_section": {
        var selectors = data.selector.split(",");
        for (var i = 0; i < selectors.length; i++) {
          var el = document.querySelector(selectors[i].trim());
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            // Brief gold highlight
            el.style.transition = "box-shadow .4s";
            el.style.boxShadow = "0 0 0 3px rgba(212,168,67,.4)";
            setTimeout(function () {
              el.style.boxShadow = "";
            }, 2000);
            break;
          }
        }
        break;
      }

      case "highlight_feature": {
        var target = document.querySelector(
          '[data-feature="' + data.feature + '"]'
        );
        if (target) {
          target.style.transition = "all .4s";
          target.style.boxShadow = "0 0 20px rgba(212,168,67,.5)";
          target.style.transform = "scale(1.02)";
          setTimeout(function () {
            target.style.boxShadow = "";
            target.style.transform = "";
          }, 3000);
        }
        break;
      }

      case "navigate_to_page": {
        if (data.route) {
          window.location.href = data.route;
        }
        break;
      }

      case "update_caption": {
        var captionEl = document.getElementById("vxr-caption");
        if (captionEl) captionEl.textContent = data.text || "";
        break;
      }
    }
  });

  // ── Keyboard shortcut: Escape to close ──
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      document.getElementById("vxr-close").click();
    }
  });
})();
