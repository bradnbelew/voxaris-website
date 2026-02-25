/**
 * Voxaris Embed Loader
 *
 * Hotel integration:
 * <script src="https://orchestrator.voxaris.io/voxaris-loader.js"
 *         data-hotel-id="UUID"
 *         data-embed-key="emb_xxxx"
 *         data-position="bottom-right"
 *         async></script>
 */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script) return;

  var hotelId = script.getAttribute("data-hotel-id");
  var embedKey = script.getAttribute("data-embed-key");
  var position = script.getAttribute("data-position") || "bottom-right";

  if (!hotelId || !embedKey) {
    console.error("[Voxaris] Missing data-hotel-id or data-embed-key");
    return;
  }

  var BASE_URL = script.src.replace("/voxaris-loader.js", "");

  // Fetch config
  fetch(BASE_URL + "/api/embed/" + hotelId + "?key=" + embedKey)
    .then(function (res) {
      if (!res.ok) throw new Error("Config load failed: " + res.status);
      return res.json();
    })
    .then(function (config) {
      createWidget(config, position);
    })
    .catch(function (err) {
      console.error("[Voxaris] Init error:", err);
    });

  function createWidget(config, pos) {
    // Inject styles
    var style = document.createElement("style");
    style.textContent = [
      ".vxr-trigger{position:fixed;bottom:16px;" +
        (pos === "bottom-left" ? "left" : "right") +
        ":16px;z-index:99999;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,.25);transition:transform .2s}",
      ".vxr-trigger:hover{transform:scale(1.1)}",
      ".vxr-panel{position:fixed;bottom:16px;" +
        (pos === "bottom-left" ? "left" : "right") +
        ":16px;z-index:99999;width:380px;height:520px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.2);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
      ".vxr-panel.open{display:flex}",
      ".vxr-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;color:#fff}",
      ".vxr-messages{flex:1;overflow-y:auto;padding:12px 16px}",
      ".vxr-msg{margin-bottom:12px}",
      ".vxr-msg-user{text-align:right}",
      ".vxr-msg-assistant{text-align:left}",
      ".vxr-bubble{display:inline-block;max-width:85%;padding:8px 12px;border-radius:12px;font-size:14px;line-height:1.4}",
      ".vxr-bubble-user{background:#1f2937;color:#fff}",
      ".vxr-bubble-assistant{background:#f3f4f6;color:#1f2937}",
      ".vxr-bubble-system{background:#fffbeb;color:#92400e;font-style:italic}",
      ".vxr-input-row{display:flex;gap:8px;padding:12px 16px;border-top:1px solid #f3f4f6}",
      ".vxr-input{flex:1;border:1px solid #e5e7eb;border-radius:9999px;padding:8px 16px;font-size:14px;outline:none}",
      ".vxr-input:focus{border-color:#9ca3af}",
      ".vxr-send{width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center}",
      ".vxr-confirm-row{display:flex;gap:8px;padding:0 16px 8px}",
      ".vxr-confirm-yes{flex:1;border:none;border-radius:8px;padding:8px;color:#fff;cursor:pointer;font-weight:500;font-size:14px}",
      ".vxr-confirm-no{flex:1;border:1px solid #d1d5db;border-radius:8px;padding:8px;background:#fff;cursor:pointer;font-weight:500;font-size:14px;color:#374151}",
      ".vxr-powered{text-align:center;padding-bottom:8px;font-size:10px;color:#9ca3af}",
      ".vxr-dots{display:flex;gap:4px;padding:8px 12px}",
      ".vxr-dot{width:8px;height:8px;border-radius:50%;background:#9ca3af;animation:vxr-bounce .6s infinite alternate}",
      ".vxr-dot:nth-child(2){animation-delay:.15s}",
      ".vxr-dot:nth-child(3){animation-delay:.3s}",
      "@keyframes vxr-bounce{to{opacity:.3;transform:translateY(-4px)}}",
    ].join("");
    document.head.appendChild(style);

    var brandColor = config.brandColor || "#d4a843";
    var sessionKey = "ses_" + Math.random().toString(36).slice(2, 18);
    var messages = [{ role: "assistant", text: config.greeting }];
    var isOpen = false;
    var isLoading = false;
    var needsConfirmation = false;

    // Create trigger button
    var trigger = document.createElement("button");
    trigger.className = "vxr-trigger";
    trigger.style.backgroundColor = brandColor;
    trigger.setAttribute("aria-label", "Open Voxaris concierge");
    trigger.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(trigger);

    // Create panel
    var panel = document.createElement("div");
    panel.className = "vxr-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", config.hotelName + " AI Concierge");
    document.body.appendChild(panel);

    function render() {
      var html = "";

      // Header
      html +=
        '<div class="vxr-header" style="background:' +
        brandColor +
        '">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<div style="width:8px;height:8px;border-radius:50%;background:#86efac"></div>' +
        "<span>" +
        config.hotelName +
        " Concierge</span></div>" +
        '<button onclick="document.querySelector(\'.vxr-panel\').classList.remove(\'open\');document.querySelector(\'.vxr-trigger\').style.display=\'flex\'" style="background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer" aria-label="Close">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>';

      // Messages
      html += '<div class="vxr-messages" id="vxr-msgs">';
      messages.forEach(function (msg) {
        var cls =
          msg.role === "user"
            ? "vxr-msg-user"
            : msg.role === "system"
              ? "vxr-msg-system"
              : "vxr-msg-assistant";
        var bubbleCls =
          msg.role === "user"
            ? "vxr-bubble-user"
            : msg.role === "system"
              ? "vxr-bubble-system"
              : "vxr-bubble-assistant";
        html +=
          '<div class="vxr-msg ' +
          cls +
          '"><div class="vxr-bubble ' +
          bubbleCls +
          '">' +
          escapeHtml(msg.text) +
          "</div></div>";
      });
      if (isLoading) {
        html +=
          '<div class="vxr-msg vxr-msg-assistant"><div class="vxr-bubble vxr-bubble-assistant"><div class="vxr-dots"><span class="vxr-dot"></span><span class="vxr-dot"></span><span class="vxr-dot"></span></div></div></div>';
      }
      html += "</div>";

      // Confirm buttons
      if (needsConfirmation) {
        html +=
          '<div class="vxr-confirm-row">' +
          '<button class="vxr-confirm-yes" style="background:' +
          brandColor +
          '" id="vxr-yes">Confirm Booking</button>' +
          '<button class="vxr-confirm-no" id="vxr-no">Cancel</button></div>';
      }

      // Input
      html +=
        '<form class="vxr-input-row" id="vxr-form">' +
        '<input class="vxr-input" id="vxr-input" placeholder="Ask me anything..." ' +
        (isLoading ? "disabled" : "") +
        "/>" +
        '<button type="submit" class="vxr-send" style="background:' +
        brandColor +
        '" ' +
        (isLoading ? "disabled" : "") +
        ' aria-label="Send">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></form>';

      html += '<div class="vxr-powered">Powered by Voxaris</div>';

      panel.innerHTML = html;

      // Scroll to bottom
      var msgContainer = document.getElementById("vxr-msgs");
      if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;

      // Bind events
      var form = document.getElementById("vxr-form");
      if (form)
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var inp = document.getElementById("vxr-input");
          if (inp && inp.value.trim()) {
            sendMsg(inp.value.trim());
          }
        });

      var yesBtn = document.getElementById("vxr-yes");
      if (yesBtn)
        yesBtn.addEventListener("click", function () {
          needsConfirmation = false;
          sendMsg("Yes, I confirm", { granted: true, method: "button" });
        });

      var noBtn = document.getElementById("vxr-no");
      if (noBtn)
        noBtn.addEventListener("click", function () {
          needsConfirmation = false;
          sendMsg("No, cancel", { granted: false, method: "button" });
        });
    }

    function sendMsg(text, consentResponse) {
      messages.push({ role: "user", text: text });
      isLoading = true;
      render();

      var body = {
        sessionKey: sessionKey,
        hotelId: config.hotelId,
        userMessage: text,
      };
      if (consentResponse) body.consentResponse = consentResponse;

      fetch(config.orchestrateEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (data) {
          messages.push({ role: "assistant", text: data.response });
          needsConfirmation = data.requiresConfirmation;
          if (data.sessionStatus === "handoff") {
            messages.push({
              role: "system",
              text: "Connecting you to a team member...",
            });
          }
        })
        .catch(function () {
          messages.push({
            role: "system",
            text: "I had trouble with that. Could you try again?",
          });
        })
        .finally(function () {
          isLoading = false;
          render();
        });
    }

    function escapeHtml(str) {
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    // Event handlers
    trigger.addEventListener("click", function () {
      isOpen = true;
      panel.classList.add("open");
      trigger.style.display = "none";
      render();
    });

    // Initial render
    render();
  }
})();
