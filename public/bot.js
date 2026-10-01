(function () {
  if (document.getElementById('parv-chat-widget-container')) {
    document.getElementById('parv-chat-widget-container').remove();
    document.getElementById('parv-chatbot-styles')?.remove();
  }

  const style = document.createElement('style');
  style.id = 'parv-chatbot-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Outfit:wght@400;500;600&display=swap');
    #parv-chat-widget-container, #parv-chat-widget-container * { box-sizing: border-box!important; font-family: 'Outfit', sans-serif; margin: 0; padding: 0; }
    #parv-chat-widget-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999999; display: flex; flex-direction: column; align-items: flex-end; }
.parv-trigger-wrap { position: relative; }
.parv-trigger-pulse { position: absolute; inset: 0; border-radius: 50%; background: #111; animation: parv-pulse 2.5s infinite; }
    @keyframes parv-pulse { 0% { transform: scale(1); opacity:.3 } 100% { transform: scale(1.9); opacity: 0 } }
.parv-trigger { width: 62px; height: 62px; border-radius: 50%; background: radial-gradient(120% 120% at 30% 20%, #2A2A2A 0%, #111 100%); color: #fff; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 12px 28px rgba(0,0,0,0.22); cursor: pointer; display: grid; place-items: center; }
.parv-window { width: 392px; max-width: calc(100vw - 32px); height: 640px; max-height: calc(100vh - 100px); background: #FFFEFB; border: 1px solid rgba(0,0,0,0.08); border-radius: 28px; box-shadow: 0 24px 64px rgba(0,0,0,0.16); display: flex; flex-direction: column; overflow: hidden; margin-bottom: 18px; opacity: 0; transform: translateY(16px) scale(0.97); pointer-events: none; transition: all 0.48s cubic-bezier(0.16,1,0.3,1); transform-origin: bottom right; }
.parv-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
.parv-header { padding: 16px 24px!important; background: #FFFEFB; border-bottom: 1px solid rgba(0,0,0,0.07); display: flex; align-items: center; justify-content: space-between; }
.parv-header-left { display: flex; align-items: center; gap: 12px; }
.parv-avatar { width: 40px; height: 40px; border-radius: 50%; background: #111; color: #fff; display: grid; place-items: center; font-family: 'Fraunces', serif; font-weight: 600; }
.parv-title { font-family: 'Fraunces', serif; font-weight: 600; font-size: 16px; color: #111; }
.parv-status { font-size: 12px; color: #6B7280; display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.parv-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; box-shadow: 0 0 0 4px rgba(22,163,74,0.15); }
.parv-close-btn { width: 32px; height: 32px; border-radius: 50%; background: #F6F3EE; border: 1px solid rgba(0,0,0,0.06); cursor: pointer; display: grid; place-items: center; }
.parv-messages { flex: 1; padding: 24px!important; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background-color: #FDFBF7; }
.parv-msg-row { display: flex; gap: 10px; align-items: flex-end; width: 100%; animation: parv-in 0.38s cubic-bezier(0.16,1,0.3,1); }
.parv-msg-row.user { justify-content: flex-end; }
    @keyframes parv-in { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform: translateY(0) } }
.parv-msg-avatar { width: 28px; height: 28px; border-radius: 50%; background: #111; color: #fff; display: grid; place-items: center; font-size: 11px; flex-shrink: 0; }
.parv-msg { max-width: 75%!important; padding: 12px 16px!important; border-radius: 20px; font-size: 14px; line-height: 1.55; word-wrap: break-word; }
.parv-msg.bot { background: #fff; border: 1px solid rgba(0,0,0,0.07); color: #1F1F1F; border-bottom-left-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); margin-right: auto; }
.parv-msg.user { background: #111; color: #FFFEFB; border-bottom-right-radius: 6px; margin-left: auto; }
.parv-chips { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.parv-chip { background: #fff; border: 1px solid rgba(0,0,0,0.08); color: #111; padding: 12px 14px!important; border-radius: 14px; font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; transition: all 0.22s; }
.parv-chip:hover { background: #111; color: #fff; transform: translateY(-2px); }
.parv-input-area { padding: 16px 24px!important; background: #FFFEFB; border-top: 1px solid rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 10px; }
.parv-input-wrap { display: flex; align-items: center; gap: 8px; background: #F6F3EE; border: 1px solid rgba(0,0,0,0.06); border-radius: 100px; padding: 5px 6px 5px 18px!important; }
.parv-input { flex: 1; background: transparent; border: none; outline: none; font-size: 14px; color: #111; padding: 9px 0; }
.parv-send-btn { width: 40px; height: 40px; border-radius: 50%; border: none; cursor: pointer; background: #111; color: #fff; display: grid; place-items: center; }
.parv-foot { text-align: center; font-size: 11px; color: #9CA3AF; }
.parv-typing { display: flex; gap: 4px; padding: 14px 16px; background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 18px; border-bottom-left-radius: 6px; }
.parv-dot-typing { width: 6px; height: 6px; background: #111; border-radius: 50%; animation: parv-b 1.2s infinite; }
.parv-dot-typing:nth-child(2){animation-delay:.15s}.parv-dot-typing:nth-child(3){animation-delay:.3s}
    @keyframes parv-b { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }
  `;
  document.head.appendChild(style);

  const WEBHOOK_URL = 'https://n8n.propwiseai.in/webhook/website%20chatbot';
  const SESSION_ID = 'parv_' + Math.random().toString(36).slice(2,9);
  let pendingEnquiry = null;
  let waitingForCustomerDetails = false;
  let currentEnquiryId = null;
  let selectedCategory = "";
  let categoryMenuShown = false;

  const container = document.createElement('div');
  container.id = 'parv-chat-widget-container';
  container.innerHTML = `
    <div class="parv-window" id="parvWindow">
      <div class="parv-header"><div class="parv-header-left"><div class="parv-avatar">P</div><div><div class="parv-title">Parv Industries</div><div class="parv-status"><span class="parv-dot"></span> Online</div></div></div><button class="parv-close-btn" id="parvCloseBtn">✕</button></div>
      <div class="parv-messages" id="parvMessages"><div class="parv-chips" id="parvChips"></div></div>
      <div class="parv-input-area"><div class="parv-input-wrap"><input type="text" class="parv-input" id="parvInput" placeholder="Ask about spices, bulk orders..." autocomplete="off" /><button class="parv-send-btn" id="parvSendBtn">➤</button></div><div class="parv-foot">Built for business • <strong>Parv Industries</strong></div></div>
    </div>
    <div class="parv-trigger-wrap"><div class="parv-trigger-pulse" id="parvPulse"></div><button class="parv-trigger" id="parvTrigger"><span class="parv-trigger-icon" id="parvTriggerIcon">💬</span></button></div>
  `;
  document.body.appendChild(container);

  const windowEl = document.getElementById('parvWindow');
  const triggerEl = document.getElementById('parvTrigger');
  const triggerIcon = document.getElementById('parvTriggerIcon');
  const pulseEl = document.getElementById('parvPulse');
  const closeBtn = document.getElementById('parvCloseBtn');
  const sendBtn = document.getElementById('parvSendBtn');
  const inputEl = document.getElementById('parvInput');
  const parvMessages = document.getElementById("parvMessages");
  const parvChips = document.getElementById("parvChips");

  function addMessage(text, sender) {
    if (!text) return;
    const row = document.createElement('div');
    row.className = `parv-msg-row ${sender === 'user'? 'user' : ''}`;
    row.innerHTML = sender === 'bot'? `<div class="parv-msg-avatar">P</div><div class="parv-msg bot">${text.replace(/\n/g,'<br>')}</div>` : `<div class="parv-msg user">${text}</div>`;
    parvMessages.appendChild(row);
    parvMessages.scrollTop = parvMessages.scrollHeight;
  }

  function renderCategoryMenu(buttons) {
    parvChips.innerHTML = "";
    buttons.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "parv-chip";
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        addMessage(item.label, "user");
        if (["loose_spices","fancy_box","hanger","noodles","coconut_water"].includes(item.id)) {
          selectedCategory = item.id;
        }
        sendAction(item.id);
      });
      parvChips.appendChild(btn);
    });
    parvMessages.appendChild(parvChips);
    categoryMenuShown = true;
  }

  function renderButtonsBelowMessage(buttons) {
    if (!Array.isArray(buttons) || buttons.length === 0) return;
    parvChips.innerHTML = "";
    buttons.forEach((b) => {
      const btn = document.createElement('button');
      btn.className = 'parv-chip';
      btn.textContent = b.label;
      btn.onclick = () => {
        addMessage(b.label, "user");
        if (["loose_spices","fancy_box","hanger","noodles","coconut_water"].includes(b.id)) {
          selectedCategory = b.id;
        }
        sendAction(b.id);
      };
      parvChips.appendChild(btn);
    });
    parvMessages.appendChild(parvChips);
  }

  function renderButtons(buttons) {
    if (!Array.isArray(buttons) || buttons.length === 0) return;
    parvChips.innerHTML = "";
    buttons.forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "parv-chip";
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        addMessage(item.label, "user");
        if (["loose_spices","fancy_box","hanger","noodles","coconut_water"].includes(item.id)) {
          selectedCategory = item.id;
        }
        sendAction(item.id);
      });
      parvChips.appendChild(btn);
    });
    parvMessages.appendChild(parvChips);
  }

  async function sendAction(action) {
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          sessionId: SESSION_ID,
    ...(action === "confirm_enquiry"? { enquiry: pendingEnquiry } : {})
        })
      });
      const result = await response.json();
      console.log("Edit response:", JSON.stringify(result, null, 2));
      if (result.category && result.product && result.quantity) {
        pendingEnquiry = {
          category: result.category,
          product: result.product,
          quantity: result.quantity
        };
      }

      if (result.message) addMessage(result.message, "bot");

      if (action === "confirm_enquiry" && result.enquiryId) {
        currentEnquiryId = result.enquiryId;
        console.log("Saved Enquiry ID:", currentEnquiryId);
      }

      if (action === "confirm_enquiry") {
        waitingForCustomerDetails = true;
        const res2 = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "request_customer_details",
            sessionId: SESSION_ID
          })
        });

        const detailsResponse = await res2.json();

        if (detailsResponse.message) {
          addMessage(detailsResponse.message, "bot");
        }
      }

      if (result.type === "pdf" && result.document?.url) {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "width:100%;padding:8px;box-sizing:border-box;";
        const iframe = document.createElement("iframe");
        iframe.src = result.document.url;
        iframe.title = result.document.name || "PDF";
        iframe.style.cssText = "display:block;width:100%;height:400px;border:0;border-radius:10px;background:white;";
        wrapper.appendChild(iframe);
        parvMessages.appendChild(wrapper);
      }

      if (action === "price_list") {
        setTimeout(() => sendAction("show_categories"), 3000);
      } else if (action === "show_categories") {
        renderCategoryMenu(result.buttons || []);
      } else {
        if (result.buttons && result.buttons.length > 0) {
          renderButtons(result.buttons);
        }
      }
    } catch (e) {
      addMessage("Sorry, something went wrong. Please try again.", "bot");
    }
  }

  ["🌶 Spices List", "🥥 Coconut Water", "🍜 Noodles", "📦 Bulk Quote"].forEach(text => {
    const chip = document.createElement('button');
    chip.className = 'parv-chip';
    chip.textContent = text;
    chip.onclick = () => { inputEl.value = text; sendMessage(); };
    parvChips.appendChild(chip);
  });

  let isOpen = false;
  function toggle() { isOpen=!isOpen; windowEl.classList.toggle('open', isOpen); triggerIcon.textContent=isOpen?'✕':'💬'; pulseEl.style.display=isOpen?'none':'block'; }
  triggerEl.onclick = toggle; closeBtn.onclick = toggle;

  async function sendMessage() {
    const text = inputEl.value.trim(); if (!text) return; inputEl.value=''; addMessage(text,"user");
    const typingRow = document.createElement('div'); typingRow.className='parv-msg-row'; typingRow.id='parv-typing-row';
    typingRow.innerHTML=`<div class="parv-msg-avatar">P</div><div class="parv-typing"><div class="parv-dot-typing"></div><div class="parv-dot-typing"></div><div class="parv-dot-typing"></div></div>`;
    parvMessages.appendChild(typingRow);
    try {
      console.log("Sending action:", waitingForCustomerDetails
       ? "customer_details"
        : "normal enquiry");
      const res = await fetch(WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
        action: waitingForCustomerDetails? "customer_details" : undefined,
        chatInput: text,
        message: text,
        payload: { text },
        sessionId: SESSION_ID,
        category: selectedCategory,
        enquiry: pendingEnquiry,
        enquiryId: currentEnquiryId
      }) });
      document.getElementById('parv-typing-row')?.remove();
      let result = await res.text(); try{ const d=JSON.parse(result); result=Array.isArray(d)?d[0]:d; }catch{}
      if (typeof result==='object'){
        addMessage(result.message||result.output||result.text||result,"bot");
        if (result.category && result.product && result.quantity) {
          pendingEnquiry = {
            category: result.category,
            product: result.product,
            quantity: result.quantity
          };
        }
        if (result.buttons && result.buttons.length > 0) {
          renderButtons(result.buttons);
        }
        if(result.buttons?.length &&!categoryMenuShown) {
          renderButtonsBelowMessage(result.buttons);
        }
      } else addMessage(result,"bot");
    } catch(e){ document.getElementById('parv-typing-row')?.remove(); addMessage("Sorry, something went wrong.","bot"); }
  }
  sendBtn.onclick=sendMessage; inputEl.onkeydown=(e)=>{ if(e.key==='Enter') sendMessage(); };
  setTimeout(toggle,700);
})();
