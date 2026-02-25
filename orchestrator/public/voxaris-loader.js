/**
 * Voxaris Embed Loader — Tavus CVI Avatar + Navigation Bridge
 *
 * Self-demo on voxaris.io:
 * <script src="https://voxaris-orchestrator.vercel.app/voxaris-loader.js"
 *         data-mode="self-demo"
 *         data-persona-id="p40793780aaa"
 *         data-agent-name="Maria"
 *         async></script>
 *
 * Hotel/client integration:
 * <script src="https://voxaris-orchestrator.vercel.app/voxaris-loader.js"
 *         data-hotel-id="UUID"
 *         data-embed-key="emb_xxxx"
 *         data-agent-name="Maria"
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
  var agentName = script.getAttribute("data-agent-name") || "Maria";
  var position = script.getAttribute("data-position") || "bottom-right";
  var thumbnailUrl = script.getAttribute("data-thumbnail") || "https://cdn.replica.tavus.io/39359/cd603e65.mp4";
  var BASE_URL = script.getAttribute("data-api-base") || script.src.replace(/\/[^/]*$/, "");
  var posRight = position !== "bottom-left";

  // ── Inject Satoshi font ──
  if (!document.querySelector('link[href*="fontshare"][href*="satoshi"]')) {
    var fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap";
    document.head.appendChild(fontLink);
  }

  // ── Styles ──
  var FONT = "'Satoshi', 'Inter', system-ui, -apple-system, sans-serif";
  var css = document.createElement("style");
  css.textContent = [
    /* ── Trigger pill ── */
    ".vxr-trigger{" +
      "position:fixed;bottom:28px;" + (posRight ? "right" : "left") + ":28px;" +
      "z-index:99998;display:flex;align-items:center;gap:12px;" +
      "padding:6px 20px 6px 6px;" +
      "border-radius:999px;cursor:pointer;" +
      "background:rgba(10,10,10,.92);" +
      "backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);" +
      "border:1px solid rgba(255,255,255,.08);" +
      "box-shadow:0 4px 24px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.04);" +
      "transition:all .35s cubic-bezier(.4,0,.2,1);" +
      "font-family:" + FONT + "}",
    ".vxr-trigger:hover{" +
      "transform:translateY(-2px);" +
      "box-shadow:0 8px 40px rgba(0,0,0,.5),0 0 60px rgba(192,192,192,.06),0 0 0 1px rgba(255,255,255,.1);" +
      "border-color:rgba(255,255,255,.12)}",

    /* Avatar circle with live video thumbnail */
    ".vxr-trigger-avatar{" +
      "width:44px;height:44px;border-radius:50%;" +
      "background:#171717;overflow:hidden;flex-shrink:0;position:relative;" +
      "border:1.5px solid rgba(255,255,255,.1)}",
    ".vxr-trigger-avatar video{" +
      "width:100%;height:100%;object-fit:cover;border-radius:50%}",
    /* Green online dot */
    ".vxr-trigger-dot{" +
      "position:absolute;bottom:0;right:0;width:11px;height:11px;" +
      "border-radius:50%;background:#22c55e;" +
      "border:2.5px solid #0a0a0a;" +
      "animation:vxr-pulse 2.5s ease-in-out infinite}",

    /* Text */
    ".vxr-trigger-text{" +
      "display:flex;flex-direction:column;gap:1px}",
    ".vxr-trigger-name{" +
      "color:#fafafa;font-size:14px;font-weight:600;letter-spacing:-.01em;line-height:1.2}",
    ".vxr-trigger-sub{" +
      "color:rgba(163,163,163,.8);font-size:11px;font-weight:500;letter-spacing:.02em}",

    /* ── Video panel ── */
    ".vxr-panel{" +
      "position:fixed;bottom:28px;" + (posRight ? "right" : "left") + ":28px;" +
      "z-index:99999;width:380px;height:560px;" +
      "border-radius:16px;overflow:hidden;display:none;flex-direction:column;" +
      "background:#0a0a0a;" +
      "border:1px solid rgba(255,255,255,.06);" +
      "box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.04);" +
      "font-family:" + FONT + ";" +
      "transition:all .3s}",
    ".vxr-panel.open{display:flex}",

    /* Panel header */
    ".vxr-header{" +
      "display:flex;align-items:center;justify-content:space-between;" +
      "padding:14px 16px;" +
      "background:rgba(23,23,23,.6);" +
      "backdrop-filter:blur(12px);" +
      "border-bottom:1px solid rgba(255,255,255,.06)}",
    ".vxr-header-left{display:flex;align-items:center;gap:10px}",
    ".vxr-header-avatar{" +
      "width:32px;height:32px;border-radius:50%;overflow:hidden;" +
      "border:1px solid rgba(255,255,255,.1);flex-shrink:0}",
    ".vxr-header-avatar video{width:100%;height:100%;object-fit:cover}",
    ".vxr-header-info{display:flex;flex-direction:column;gap:1px}",
    ".vxr-header-name{color:#fafafa;font-size:13px;font-weight:600;letter-spacing:-.005em}",
    ".vxr-header-status{display:flex;align-items:center;gap:5px}",
    ".vxr-header-dot{" +
      "width:6px;height:6px;border-radius:50%;background:#22c55e;" +
      "animation:vxr-pulse 2.5s ease-in-out infinite}",
    ".vxr-header-live{color:rgba(163,163,163,.7);font-size:10px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}",
    ".vxr-close{" +
      "background:none;border:none;color:rgba(163,163,163,.5);" +
      "cursor:pointer;padding:6px;border-radius:8px;" +
      "transition:all .2s;display:flex;align-items:center;justify-content:center}",
    ".vxr-close:hover{color:#fafafa;background:rgba(255,255,255,.06)}",

    /* Video container */
    ".vxr-video{flex:1;position:relative;background:#0a0a0a;overflow:hidden}",
    ".vxr-video iframe{width:100%;height:100%;border:none}",
    ".vxr-video-placeholder{" +
      "width:100%;height:100%;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;gap:16px;color:rgba(163,163,163,.5)}",

    /* Loading spinner */
    ".vxr-spinner{" +
      "width:36px;height:36px;border-radius:50%;" +
      "border:2px solid rgba(255,255,255,.06);" +
      "border-top:2px solid rgba(192,192,192,.5);" +
      "animation:vxr-spin .8s linear infinite}",

    /* Caption bar */
    ".vxr-captions{" +
      "padding:10px 16px;" +
      "background:rgba(23,23,23,.4);" +
      "border-top:1px solid rgba(255,255,255,.04);" +
      "min-height:40px;display:flex;align-items:center}",
    ".vxr-caption-text{" +
      "color:rgba(245,245,245,.7);font-size:12px;font-weight:400;line-height:1.5;" +
      "max-height:36px;overflow:hidden;transition:all .3s}",

    /* Footer */
    ".vxr-footer{" +
      "display:flex;align-items:center;justify-content:space-between;" +
      "padding:8px 16px;" +
      "background:#0a0a0a;" +
      "border-top:1px solid rgba(255,255,255,.04)}",
    ".vxr-powered{" +
      "font-size:9px;color:rgba(163,163,163,.3);" +
      "letter-spacing:.06em;text-transform:uppercase;font-weight:500}",
    ".vxr-mute{" +
      "background:none;border:none;color:rgba(163,163,163,.4);" +
      "cursor:pointer;padding:6px;border-radius:8px;" +
      "transition:all .2s;display:flex;align-items:center}",
    ".vxr-mute:hover{color:#fafafa;background:rgba(255,255,255,.06)}",

    /* Draggable */
    ".vxr-dragging{cursor:grabbing!important;user-select:none}",

    /* Animations */
    "@keyframes vxr-pulse{0%,100%{opacity:1}50%{opacity:.4}}",
    "@keyframes vxr-spin{to{transform:rotate(360deg)}}",
    "@keyframes vxr-fadeIn{from{opacity:0;transform:translateY(12px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}",
    ".vxr-panel.open{animation:vxr-fadeIn .3s cubic-bezier(.16,1,.3,1)}",

    /* Mobile responsive */
    "@media(max-width:440px){" +
      ".vxr-panel{width:calc(100vw - 24px);left:12px!important;right:12px!important;bottom:12px;height:70vh;max-height:560px}" +
      ".vxr-trigger{bottom:16px;" + (posRight ? "right" : "left") + ":16px}" +
    "}"
  ].join("\n");
  document.head.appendChild(css);

  // ── Load Daily.co SDK (auto-join, dark theme, no haircheck) ──
  var dailyReady = new Promise(function (resolve) {
    if (window.DailyIframe) return resolve(window.DailyIframe);
    var s = document.createElement("script");
    s.src = "https://unpkg.com/@daily-co/daily-js";
    s.onload = function () { resolve(window.DailyIframe); };
    s.onerror = function () { resolve(null); }; // fallback to raw iframe
    document.head.appendChild(s);
  });

  // ── State ──
  var isOpen = false;
  var conversationId = null;
  var callFrame = null;
  var isMuted = false;
  var dragState = { dragging: false, offsetX: 0, offsetY: 0 };

  // ── Build avatar HTML (reused in trigger + header) ──
  function avatarVideoHtml(size) {
    return '<video width="' + size + '" height="' + size + '" autoplay loop muted playsinline ' +
      'src="' + thumbnailUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></video>';
  }

  // ── Create trigger ──
  var trigger = document.createElement("button");
  trigger.className = "vxr-trigger";
  trigger.setAttribute("aria-label", "Talk to " + agentName);
  trigger.innerHTML =
    '<div class="vxr-trigger-avatar">' +
      avatarVideoHtml(44) +
      '<div class="vxr-trigger-dot"></div>' +
    '</div>' +
    '<div class="vxr-trigger-text">' +
      '<span class="vxr-trigger-name">Talk to ' + agentName + '</span>' +
      '<span class="vxr-trigger-sub">AI Video Agent</span>' +
    '</div>';
  document.body.appendChild(trigger);

  // ── Create panel ──
  var panel = document.createElement("div");
  panel.className = "vxr-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", agentName + " — Voxaris AI Agent");
  panel.innerHTML =
    '<div class="vxr-header">' +
      '<div class="vxr-header-left">' +
        '<div class="vxr-header-avatar">' + avatarVideoHtml(32) + '</div>' +
        '<div class="vxr-header-info">' +
          '<span class="vxr-header-name">' + agentName + '</span>' +
          '<div class="vxr-header-status">' +
            '<div class="vxr-header-dot"></div>' +
            '<span class="vxr-header-live">Live</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button class="vxr-close" id="vxr-close" aria-label="Close">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
        '</svg>' +
      '</button>' +
    '</div>' +
    '<div class="vxr-video" id="vxr-video">' +
      '<div class="vxr-video-placeholder" id="vxr-placeholder">' +
        '<div class="vxr-spinner"></div>' +
        '<span style="font-size:13px;font-weight:500;letter-spacing:.01em">Connecting to ' + agentName + '...</span>' +
      '</div>' +
    '</div>' +
    '<div class="vxr-captions"><span class="vxr-caption-text" id="vxr-caption"></span></div>' +
    '<div class="vxr-footer">' +
      '<span class="vxr-powered">Powered by Voxaris</span>' +
      '<button class="vxr-mute" id="vxr-mute" aria-label="Mute">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19"/>' +
          '<path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>' +
        '</svg>' +
      '</button>' +
    '</div>';
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
    if (callFrame) {
      callFrame.setLocalAudio(!isMuted);
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
    x = Math.max(0, Math.min(window.innerWidth - 380, x));
    y = Math.max(0, Math.min(window.innerHeight - 560, y));
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
    if (placeholder) {
      var span = placeholder.querySelector("span");
      if (span) span.textContent = "Connecting to " + agentName + "...";
    }

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
          var spinner = placeholder.querySelector(".vxr-spinner");
          if (spinner) spinner.style.display = "none";
          var span = placeholder.querySelector("span");
          if (span) {
            span.textContent = "Connection failed. Tap to retry.";
            span.style.cursor = "pointer";
          }
          placeholder.style.cursor = "pointer";
          placeholder.onclick = function () {
            if (spinner) spinner.style.display = "block";
            if (span) {
              span.textContent = "Reconnecting...";
              span.style.cursor = "default";
            }
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

    dailyReady.then(function (DailyIframe) {
      if (placeholder) placeholder.remove();

      if (DailyIframe) {
        // ── Daily.co SDK: auto-join, dark theme, no haircheck ──
        callFrame = DailyIframe.createFrame(container, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "0",
            background: "#0a0a0a",
          },
          showLeaveButton: false,
          showFullscreenButton: false,
          showLocalVideo: false,
          showParticipantsBar: false,
          activeSpeakerMode: true,
          theme: {
            colors: {
              accent: "#c0c0c0",
              accentText: "#fafafa",
              background: "#0a0a0a",
              backgroundAccent: "#171717",
              baseText: "#fafafa",
              border: "rgba(255,255,255,0.08)",
              mainAreaBg: "#0a0a0a",
              mainAreaBgAccent: "#0f0f0f",
              mainAreaText: "#fafafa",
              supportiveText: "#737373",
            },
          },
        });

        callFrame.join({
          url: conversationUrl,
          userName: "Visitor",
          startVideoOff: false,
          startAudioOff: false,
        }).catch(function (err) {
          console.error("[Voxaris] Daily join failed:", err);
        });

        // Listen for call end
        callFrame.on("left-meeting", function () {
          if (isOpen) document.getElementById("vxr-close").click();
        });
      } else {
        // ── Fallback: raw iframe (if Daily SDK fails to load) ──
        var iframe = document.createElement("iframe");
        iframe.src = conversationUrl;
        iframe.allow = "camera;microphone;display-capture;autoplay";
        iframe.style.cssText = "width:100%;height:100%;border:none;background:#0a0a0a";
        container.appendChild(iframe);
      }
    });
  }

  function endConversation() {
    if (!conversationId) return;

    // End via Daily SDK
    if (callFrame) {
      try { callFrame.leave(); } catch (e) {}
      try { callFrame.destroy(); } catch (e) {}
      callFrame = null;
    }

    // Best-effort API cleanup
    fetch(BASE_URL + "/api/tavus/conversation/" + conversationId, {
      method: "DELETE",
    }).catch(function () {});

    // Remove any iframe remnants
    var iframes = panel.querySelectorAll("iframe");
    for (var i = 0; i < iframes.length; i++) iframes[i].remove();

    // Re-add placeholder
    var container = document.getElementById("vxr-video");
    if (container) {
      container.innerHTML = "";
      var placeholder = document.createElement("div");
      placeholder.className = "vxr-video-placeholder";
      placeholder.id = "vxr-placeholder";
      placeholder.innerHTML =
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3">' +
          '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>' +
        '</svg>' +
        '<span style="font-size:13px;font-weight:500">Session ended</span>';
      container.appendChild(placeholder);
    }

    conversationId = null;
  }

  // ── Navigation Bridge (postMessage) ──
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
            el.style.transition = "box-shadow .5s ease-out";
            el.style.boxShadow = "0 0 0 2px rgba(192,192,192,.2)";
            setTimeout(function () { el.style.boxShadow = ""; }, 2500);
            break;
          }
        }
        break;
      }

      case "highlight_feature": {
        var target = document.querySelector('[data-feature="' + data.feature + '"]');
        if (target) {
          target.style.transition = "all .4s ease-out";
          target.style.boxShadow = "0 0 40px rgba(192,192,192,.12),0 0 0 1px rgba(255,255,255,.1)";
          target.style.transform = "scale(1.01)";
          setTimeout(function () {
            target.style.boxShadow = "";
            target.style.transform = "";
          }, 3000);
        }
        break;
      }

      case "navigate_to_page": {
        if (data.route) window.location.href = data.route;
        break;
      }

      case "update_caption": {
        var captionEl = document.getElementById("vxr-caption");
        if (captionEl) captionEl.textContent = data.text || "";
        break;
      }
    }
  });

  // ── Keyboard: Escape to close ──
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) {
      document.getElementById("vxr-close").click();
    }
  });
})();
