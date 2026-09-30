
(function () {
  // Prevent duplicate chatbot widgets
  if (document.getElementById('parv-chat-widget-container')) {
    document.getElementById('parv-chat-widget-container').remove();
    document.getElementById('parv-chatbot-styles')?.remove();
  }

  const style = document.createElement('style');
  style.id = 'parv-chatbot-styles';
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Outfit:wght@400;500;600&display=swap');

    #parv-chat-widget-container, #parv-chat-widget-container * {
      box-sizing: border-box !important;
      font-family: 'Outfit', sans-serif;
      margin: 0;
      padding: 0;
    }

    #parv-chat-widget-container {
      position: fixed; bottom: 24px; right: 24px;
      z-index: 9999999;
      display: flex; flex-direction: column; align-items: flex-end;
    }

    .parv-trigger-wrap { position: relative; }

    .parv-trigger-pulse {
      position: absolute; inset: 0; border-radius: 50%;
      background: #111; animation: parv-pulse 2.5s infinite;
    }

    @keyframes parv-pulse {
      0% { transform: scale(1); opacity: .3 }
      100% { transform: scale(1.9); opacity: 0 }
    }

    .parv-trigger {
      width: 62px; height: 62px; border-radius: 50%;
      background: radial-gradient(120% 120% at 30% 20%, #2A2A2A 0%, #111 100%);
      color: #fff; border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 12px 28px rgba(0,0,0,0.22);
      cursor: pointer; display: grid; place-items: center;
      transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    }

    .parv-window {
      width: 392px; max-width: calc(100vw - 32px);
      height: 640px; max-height: calc(100vh - 100px);
      background: #FFFEFB;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 28px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.16);
      display: flex; flex-direction: column;
      overflow: hidden; margin-bottom: 18px;
      opacity: 0; transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: all 0.48s cubic-bezier(0.16,1,0.3,1);
      transform-origin: bottom right;
    }

    .parv-window.open {
      opacity: 1; transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .parv-header {
      padding: 16px 24px !important;
      background: #FFFEFB;
      border-bottom: 1px solid rgba(0,0,0,0.07);
      display: flex; align-items: center; justify-content: space-between;
    }

    .parv-header-left { display: flex; align-items: center; gap: 12px; }

    .parv-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: #111; color: #fff;
      display: grid; place-items: center;
      font-family: 'Fraunces', serif; font-weight: 600;
    }

    .parv-title {
      font-family: 'Fraunces', serif;
      font-weight: 600; font-size: 16px; color: #111;
    }

    .parv-status {
      font-size: 12px; color: #6B7280;
      display: flex; align-items: center; gap: 6px; margin-top: 3px;
    }

    .parv-dot {
      width: 6px; height: 6px; background: #16a34a;
      border-radius: 50%; box-shadow: 0 0 0 4px rgba(22,163,74,0.15);
    }

    .parv-close-btn {
      width: 32px; height: 32px; border-radius: 50%;
      background: #F6F3EE; border: 1px solid rgba(0,0,0,0.06);
      cursor: pointer; display: grid; place-items: center;
    }

    .parv-messages {
      flex: 1;
      padding: 24px !important;
      overflow-y: auto;
      display: flex; flex-direction: column; gap: 16px;
      background-color: #FDFBF7;
      position: relative; isolation: isolate;
    }

    .parv-messages::before {
      content: ''; position: absolute; inset: 0; z-index: -2;
      background-image:
        linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
      background-size: 28px 28px; opacity: 0.6;
    }

    .parv-messages::after {
      content: ''; position: absolute; inset: 0; z-index: -1;
      pointer-events: none; opacity: 0;
      background: radial-gradient(500px circle at var(--mx, 50%) var(--my, 50%), rgba(17,17,17,0.06), transparent 60%);
      transition: opacity 0.4s ease;
    }

    .parv-messages:hover::after { opacity: 1; }

    .parv-msg-row {
      display: flex; gap: 10px; align-items: flex-end;
      width: 100%;
      animation: parv-in 0.38s cubic-bezier(0.16,1,0.3,1);
    }

    .parv-msg-row.user { justify-content: flex-end; }

    @keyframes parv-in {
      from { opacity:0; transform:translateY(10px) }
      to { opacity:1; transform:translateY(0) }
    }

    .parv-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%;
      background: #111; color: #fff;
      display: grid; place-items: center;
      font-size: 11px; flex-shrink: 0;
    }

    .parv-msg {
      max-width: 80% !important;
      padding: 12px 16px !important;
      border-radius: 20px; font-size: 14px;
      line-height: 1.55; overflow-wrap: anywhere;
    }

    .parv-msg.bot {
      background: #fff; border: 1px solid rgba(0,0,0,0.07);
      color: #1F1F1F; border-bottom-left-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-right: auto;
    }

    .parv-msg.user {
      background: #111; color: #FFFEFB;
      border-bottom-right-radius: 6px; margin-left: auto;
    }

    .parv-chips {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      gap: 10px !important; width: 100% !important;
    }

    .parv-chip {
      background: #fff; border: 1px solid rgba(0,0,0,0.08);
      color: #111; padding: 12px 14px !important;
      border-radius: 14px; font-size: 13px; font-weight: 500;
      cursor: pointer; text-align: left; transition: all 0.22s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }

    .parv-chip:hover {
      background: #111; color: #fff; transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.16);
    }

    .parv-pdf {
      width: 100%; height: 300px; border: 1px solid #ddd;
      border-radius: 12px; background: #fff;
    }

    .parv-pdf-title {
      font-size: 13px; font-weight: 600; margin-bottom: 8px;
      color: #222;
    }

    .parv-pdf-wrap { width: 100%; max-width: 100%; }

    .parv-input-area {
      padding: 16px 24px !important;
      background: #FFFEFB;
      border-top: 1px solid rgba(0,0,0,0.07);
      display: flex; flex-direction: column; gap: 10px;
    }

    .parv-input-wrap {
      display: flex; align-items: center; gap: 8px;
      background: #F6F3EE;
      border: 1px solid rgba(0,0,0,0.06);
      border-radius: 100px; padding: 5px 6px 5px 18px !important;
      transition: all 0.25s;
    }

    .parv-input-wrap:focus-within {
      background: #fff; border-color: #111;
      box-shadow: 0 0 0 4px rgba(0,0,0,0.06);
    }

    .parv-input {
      flex: 1; min-width: 0; background: transparent;
      border: none; outline: none; font-size: 14px;
      color: #111; padding: 9px 0;
    }

    .parv-send-btn {
      width: 40px; height: 40px; border-radius: 50%;
      border: none; cursor: pointer; background: #111;
      color: #fff; display: grid; place-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.2s;
    }

    .parv-send-btn:hover { transform: scale(1.08); }
    .parv-send-btn:disabled { opacity: .5; cursor: wait; }

    .parv-foot { text-align: center; font-size: 11px; color: #9CA3AF; }
    .parv-foot strong { color: #111; }

    .parv-typing {
      display: flex; gap: 4px; padding: 14px 16px;
      background: #fff; border: 1px solid rgba(0,0,0,0.07);
      border-radius: 18px; border-bottom-left-radius: 6px;
    }

    .parv-dot-typing {
      width: 6px; height: 6px; background: #111;
      border-radius: 50%; animation: parv-b 1.2s infinite;
    }

    .parv-dot-typing:nth-child(2) { animation-delay: .15s }
    .parv-dot-typing:nth-child(3) { animation-delay: .3s }

    @keyframes parv-b {
      0%,80%,100% { transform:translateY(0);opacity:.5 }
      40% { transform:translateY(-5px);opacity:1 }
    }

    .parv-trigger-icon {
      display: grid; place-items: center;
      transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s;
    }

    @media (max-width: 480px) {
      #parv-chat-widget-container { right: 12px; bottom: 12px; }
      .parv-window {
        width: calc(100vw - 24px);
        height: min(640px, calc(100vh - 90px));
      }
      .parv-messages { padding: 16px !important; }
      .parv-header, .parv-input-area { padding-left: 16px !important; padding-right: 16px !important; }
    }
  `;

  document.head.appendChild(style);

  const WEBHOOK_URL =
    'https://n8n.propwiseai.in/webhook/website%20chatbot';

  const SESSION_ID =
    'parv_' + Math.random().toString(36).slice(2, 12);

  const container = document.createElement('div');
  container.id = 'parv-chat-widget-container';

  container.innerHTML = `
    <div class="parv-window" id="parvWindow">
      <div class="parv-header">
        <div class="parv-header-left">
          <div class="parv-avatar">P</div>
          <div>
            <div class="parv-title">Parv Industries</div>
            <div class="parv-status">
              <span class="parv-dot"></span> Online
            </div>
          </div>
        </div>
        <button class="parv-close-btn" id="parvCloseBtn" aria-label="Close chat">✕</button>
      </div>

      <div class="parv-messages" id="parvMessages">
        <div class="parv-chips" id="parvChips"></div>
      </div>

      <div class="parv-input-area">
        <div class="parv-input-wrap">
          <input
            type="text"
            class="parv-input"
            id="parvInput"
            placeholder="Type hi to get started..."
            autocomplete="off"
          />
          <button class="parv-send-btn" id="parvSendBtn" aria-label="Send">➤</button>
        </div>
        <div class="parv-foot">Built for business • <strong>Parv Industries</strong></div>
      </div>
    </div>

    <div class="parv-trigger-wrap">
      <div class="parv-trigger-pulse" id="parvPulse"></div>
      <button class="parv-trigger" id="parvTrigger" aria-label="Open chat">
        <span class="parv-trigger-icon" id="parvTriggerIcon">💬</span>
      </button>
    </div>
  `;

  document.body.appendChild(container);

  const windowEl = document.getElementById('parvWindow');
  const triggerEl = document.getElementById('parvTrigger');
  const triggerIcon = document.getElementById('parvTriggerIcon');
  const pulseEl = document.getElementById('parvPulse');
  const closeBtn = document.getElementById('parvCloseBtn');
  const sendBtn = document.getElementById('parvSendBtn');
  const inputEl = document.getElementById('parvInput');
  const messagesEl = document.getElementById('parvMessages');
  const chipsEl = document.getElementById('parvChips');

  let isOpen = false;
  let isSending = false;

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function toggle() {
    isOpen = !isOpen;
    windowEl.classList.toggle('open', isOpen);
    triggerEl.classList.toggle('open', isOpen);

    if (isOpen) {
      triggerIcon.style.transform = 'rotate(180deg) scale(0)';
      triggerIcon.style.opacity = '0';

      setTimeout(() => {
        if (isOpen) {
          triggerIcon.textContent = '✕';
          triggerIcon.style.transform = 'rotate(0deg) scale(1)';
          triggerIcon.style.opacity = '1';
        }
      }, 150);

      pulseEl.style.display = 'none';
      setTimeout(() => inputEl.focus(), 300);
    } else {
      triggerIcon.style.transform = 'rotate(-180deg) scale(0)';
      triggerIcon.style.opacity = '0';

      setTimeout(() => {
        if (!isOpen) {
          triggerIcon.textContent = '💬';
          triggerIcon.style.transform = 'rotate(0deg) scale(1)';
          triggerIcon.style.opacity = '1';
        }
      }, 150);

      pulseEl.style.display = 'block';
    }
  }

  triggerEl.onclick = toggle;
  closeBtn.onclick = toggle;

  // Add a text message safely
  function addMessage(message, sender = 'bot') {
    const row = document.createElement('div');
    row.className = 'parv-msg-row' + (sender === 'user' ? ' user' : '');

    if (sender === 'bot') {
      const avatar = document.createElement('div');
      avatar.className = 'parv-msg-avatar';
      avatar.textContent = 'P';
      row.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'parv-msg ' + sender;
    bubble.textContent = String(message ?? '');
    row.appendChild(bubble);

    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  function addTyping() {
    const row = document.createElement('div');
    row.className = 'parv-msg-row';
    row.innerHTML = `
      <div class="parv-msg-avatar">P</div>
      <div class="parv-typing">
        <div class="parv-dot-typing"></div>
        <div class="parv-dot-typing"></div>
        <div class="parv-dot-typing"></div>
      </div>
    `;
    messagesEl.appendChild(row);
    scrollToBottom();
    return row;
  }

  // Convert Google Drive download/view links into preview links
  function getPreviewUrl(url) {
    try {
      const parsed = new URL(url);

      if (parsed.hostname !== 'drive.google.com') {
        return null;
      }

      const id =
        parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
        parsed.searchParams.get('id');

      if (!id) return null;

      return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
    } catch {
      return null;
    }
  }

  // Render a PDF inside the chatbot
  function addPdfPreview(documentInfo) {
    if (!documentInfo || !documentInfo.url) return;

    const previewUrl = getPreviewUrl(documentInfo.url);

    if (!previewUrl) {
      addMessage('Sorry, this PDF link is not valid.');
      return;
    }

    const row = document.createElement('div');
    row.className = 'parv-msg-row';

    const avatar = document.createElement('div');
    avatar.className = 'parv-msg-avatar';
    avatar.textContent = 'P';

    const bubble = document.createElement('div');
    bubble.className = 'parv-msg bot parv-pdf-wrap';
    bubble.style.maxWidth = '85%';

    const title = document.createElement('div');
    title.className = 'parv-pdf-title';
    title.textContent = documentInfo.name || 'Parv Industries PDF';

    const frame = document.createElement('iframe');
    frame.className = 'parv-pdf';
    frame.src = previewUrl;
    frame.title = documentInfo.name || 'PDF preview';
    frame.loading = 'lazy';
    frame.setAttribute('allow', 'autoplay');

    bubble.appendChild(title);
    bubble.appendChild(frame);
    row.appendChild(avatar);
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    scrollToBottom();
  }

  // Render buttons sent by n8n
  function addButtons(buttons) {
    if (!Array.isArray(buttons) || buttons.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'parv-chips';

    buttons.forEach((button) => {
      const btn = document.createElement('button');
      btn.className = 'parv-chip';
      btn.type = 'button';
      btn.textContent = button.label || button.id || 'Select';

      btn.onclick = () => {
        // Send the button's ID as the action to n8n
        sendToWebhook({
          action: button.id,
          message: button.label || button.id,
          chatInput: button.label || button.id
        });
      };

      wrapper.appendChild(btn);
    });

    messagesEl.appendChild(wrapper);
    scrollToBottom();
  }

  // Normalize n8n response formats
  function normalizeResponse(data) {
    let result = data;

    if (Array.isArray(result)) {
      result = result[0] || {};
    }

    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch {
        return { message: result };
      }
    }

    if (result?.body && typeof result.body === 'object') {
      result = result.body;
    }

    if (typeof result === 'string') {
      try {
        result = JSON.parse(result);
      } catch {
        return { message: result };
      }
    }

    return result || {};
  }

  function displayResponse(data) {
    const result = normalizeResponse(data);

    if (result.success === false) {
      addMessage(result.message || 'Something went wrong. Please try again.');
      return;
    }

    // Display the response text
    const message =
      result.message ||
      result.output ||
      result.text ||
      '';

    if (message) {
      addMessage(message, 'bot');
    }

    // Display PDF if the response contains a document
    if (result.type === 'pdf' && result.document) {
      addPdfPreview(result.document);
    }

    // Display dynamic buttons returned by n8n
    if (Array.isArray(result.buttons)) {
      addButtons(result.buttons);
    }

    // Also support category/options arrays if returned by n8n
    if (Array.isArray(result.options) && !result.buttons) {
      addButtons(
        result.options.map((item) =>
          typeof item === 'string'
            ? { id: item, label: item }
            : item
        )
      );
    }

    scrollToBottom();
  }

  async function sendToWebhook(payload) {
    if (isSending) return;

    isSending = true;
    sendBtn.disabled = true;

    if (payload.message) {
      addMessage(payload.message, 'user');
    }

    // Hide initial chips after the first interaction
    chipsEl.style.display = 'none';

    const typingRow = addTyping();

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: SESSION_ID,
          action: payload.action || 'message',
          message: payload.message || '',
          chatInput: payload.chatInput || '',
          payload: {
            text: payload.message || ''
          }
        })
      });

      const responseText = await response.text();
      typingRow.remove();

      if (!response.ok) {
        throw new Error('Webhook returned HTTP ' + response.status);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      displayResponse(data);
    } catch (error) {
      typingRow.remove();
      console.error('Parv chatbot error:', error);
      addMessage('Sorry, we could not connect right now. Please try again.');
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  async function sendMessage() {
    const message = inputEl.value.trim();
    if (!message || isSending) return;

    inputEl.value = '';

    // Treat greetings as the start action
    const isGreeting = /^(hi|hello|hey)[!. ]*$/i.test(message);

    await sendToWebhook({
      action: isGreeting ? 'start' : 'message',
      message,
      chatInput: message
    });
  }

  sendBtn.onclick = sendMessage;

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });

  messagesEl.addEventListener('mousemove', (event) => {
    const rect = messagesEl.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    messagesEl.style.setProperty(
      '--mx',
      ((event.clientX - rect.left) / rect.width * 100) + '%'
    );
    messagesEl.style.setProperty(
      '--my',
      ((event.clientY - rect.top) / rect.height * 100) + '%'
    );
  });

  // Do not automatically send a welcome request on opening.
  // The customer must type hi, hello, or hey.
})();
