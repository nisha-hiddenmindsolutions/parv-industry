

/* Parv Industry - WhatsApp Product Enquiry Chatbot Widget
   4-line embed code - WhatsApp UI on website connected to n8n
   SRS Flow: STEP1 Welcome -> STEP2 Catalogue/Price -> STEP3 Categories -> STEP4 Quantity -> STEP5 Summary -> STEP6 Confirm -> STEP7 Rep
*/
(function(){
const DEFAULT_WEBHOOK = "https://n8n.propwiseai.in/webhook/website%20chatbot";
const CFG = window.PARV_CHAT_CONFIG || {};
const WEBHOOK_URL = CFG.webhookUrl || document.currentScript?.getAttribute('data-webhook') || DEFAULT_WEBHOOK;

const SESSION_KEY = "parv_whatsapp_session_id";
function getSessionId(){
  let id = localStorage.getItem(SESSION_KEY);
  if(!id){ id = 'sess_'+Date.now()+'_'+Math.random().toString(36).slice(2,9); localStorage.setItem(SESSION_KEY, id); }
  return id;
}

function injectStyles(){
 if(document.getElementById('parv-wa-style')) return;
 const css = `
 #parv-chat-root{position:fixed;bottom:20px;right:20px;z-index:999999;font-family:'Outfit',system-ui,sans-serif}
 #parv-chat-btn{width:60px;height:60px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);border:none;transition:transform .2s}
 #parv-chat-btn:hover{transform:scale(1.05)}
 #parv-chat-window{position:absolute;bottom:75px;right:0;width:390px;height:560px;background:#0B141A;border-radius:12px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.4);transform:translateY(20px) scale(.95);opacity:0;pointer-events:none;transition:all .3s ease;border:1px solid #1F2C34}
 #parv-chat-window.open{transform:translateY(0) scale(1);opacity:1;pointer-events:all}
 #parv-chat-header{background:#202C33;color:#E9EDEF;padding:12px 14px;display:flex;align-items:center;gap:10px}
 #parv-chat-header .logo{width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;color:#8B1E1E;font-size:14px}
 #parv-chat-header .title{font-weight:600;font-size:15px;line-height:1.1}
 #parv-chat-header .sub{font-size:11px;color:#8696A0}
 #parv-chat-header .close{margin-left:auto;cursor:pointer;opacity:.7;font-size:20px}
 #parv-chat-messages{flex:1;background:#0B141A url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');background-size:400px;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
 #parv-chat-messages::-webkit-scrollbar{width:4px} #parv-chat-messages::-webkit-scrollbar-thumb{background:#374045;border-radius:10px}
 .parv-msg{max-width:85%;padding:8px 10px;border-radius:8px;font-size:13.5px;line-height:1.4;position:relative;word-break:break-word;box-shadow:0 1px .5px rgba(0,0,0,.13)}
 .parv-msg.bot{background:#202C33;color:#E9EDEF;border-top-left-radius:0;align-self:flex-start}
 .parv-msg.user{background:#005C4B;color:#E9EDEF;border-top-right-radius:0;align-self:flex-end}
 .parv-msg .time{font-size:10px;color:#8696A0;margin-top:4px;text-align:right}
 .parv-buttons{display:flex;flex-direction:column;gap:8px;margin-top:8px}
 .parv-btn{background:#1F2C33;border:1px solid #2A3942;color:#E9EDEF;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;transition:all .2s;text-align:left}
 .parv-btn:hover{background:#2A3942;border-color:#00A884}
 .parv-btn .ic{font-size:16px;min-width:20px;text-align:center}
 .parv-btn:active{transform:scale(.98)}
 .parv-pdf-card{background:#1F2C33;border:1px solid #2A3942;border-radius:10px;padding:10px;display:flex;gap:10px;align-items:center;margin-top:8px}
 .parv-pdf-card .pdf-ic{width:36px;height:36px;background:#FF3B30;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:700}
 .parv-pdf-card .pdf-info{flex:1}
 .parv-pdf-card .pdf-name{font-size:12.5px;font-weight:600;color:#E9EDEF}
 .parv-pdf-card .pdf-size{font-size:10px;color:#8696A0}
 .parv-summary{background:#182229;border:1px solid #2A3942;border-radius:8px;padding:10px;margin-top:6px;font-size:12.5px}
 .parv-summary .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #1F2C33}
 .parv-summary .row:last-child{border:none}
 .parv-summary .label{color:#8696A0}
 .parv-summary .val{color:#E9EDEF;font-weight:500}
 #parv-chat-input-area{background:#202C33;padding:8px 10px;display:flex;align-items:center;gap:8px}
 #parv-chat-input{flex:1;background:#2A3942;border:none;border-radius:20px;padding:10px 14px;color:#E9EDEF;font-size:13.5px;outline:none}
 #parv-chat-input::placeholder{color:#8696A0}
 #parv-chat-send{width:42px;height:42px;border-radius:50%;background:#00A884;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:white}
 #parv-chat-send:disabled{opacity:.5;cursor:not-allowed}
 .parv-typing{font-size:11px;color:#8696A0;padding:4px 8px}
 @media(max-width:480px){#parv-chat-window{width:100vw;height:100vh;bottom:0;right:0;border-radius:0;position:fixed}#parv-chat-root{bottom:0;right:0}}
 `;
 const s=document.createElement('style'); s.id='parv-wa-style'; s.innerHTML=css; document.head.appendChild(s);
}

function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }

function renderMessage(container, text, isUser=false, buttons=null, pdfs=null, summary=null){
  const wrapper = document.createElement('div');
  wrapper.className = `parv-msg ${isUser?'user':'bot'}`;
  const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  
  let inner = `<div>${formatText(text)}</div>`;
  
  if(pdfs && pdfs.length){
    pdfs.forEach(p=>{
      inner += `<div class="parv-pdf-card" onclick="window.open('${p.url}','_blank')">
        <div class="pdf-ic">PDF</div>
        <div class="pdf-info"><div class="pdf-name">${p.name||'Document.pdf'}</div><div class="pdf-size">${p.size||'PDF'} • Tap to open</div></div>
      </div>`;
    });
  }
  if(summary){
    inner += `<div class="parv-summary">
      ${Object.entries(summary).map(([k,v])=>`<div class="row"><span class="label">${k}</span><span class="val">${v}</span></div>`).join('')}
    </div>`;
  }
  if(buttons && buttons.length){
    inner += `<div class="parv-buttons">${buttons.map(b=>{
      const icon = getIconForButton(b.id || b.label);
      return `<button class="parv-btn" data-action="${b.id}" data-label="${b.label||b.text||b.id}">
        <span class="ic">${icon}</span><span>${b.label || b.text || b.id}</span>
      </button>`;
    }).join('')}</div>`;
  }
  inner += `<div class="time">${time}</div>`;
  wrapper.innerHTML = inner;
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
  
  // attach button handlers
  wrapper.querySelectorAll('.parv-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const action = btn.getAttribute('data-action');
      const label = btn.getAttribute('data-label');
      sendToN8n(action, label, true);
    });
  });
}

function getIconForButton(id){
  id = (id||'').toLowerCase();
  if(id.includes('catalog')) return '📄';
  if(id.includes('price')) return '💰';
  if(id.includes('loose') || id.includes('spice')) return '🌶️';
  if(id.includes('fancy')) return '📦';
  if(id.includes('hanger')) return '3️⃣';
  if(id.includes('noodle')) return '🍜';
  if(id.includes('coconut')) return '🥥';
  if(id.includes('confirm')) return '✅';
  if(id.includes('edit')) return '✏️';
  if(id.includes('main') || id.includes('menu')) return '🏠';
  return '•';
}

function formatText(t){
  if(!t) return '';
  return String(t).replace(/\n/g,'<br>').replace(/\*\*(.*?)\*\*/g,'<b>$1</b>');
}

let chatHistory = [];
async function sendToN8n(action, label, isButton=false){
  const msgContainer = document.getElementById('parv-chat-messages');
  const input = document.getElementById('parv-chat-input');
  const sendBtn = document.getElementById('parv-chat-send');
  
  let userText = label || action;
  if(isButton){
    renderMessage(msgContainer, userText, true);
  }
  
  // show typing
  const typing = el(`<div class="parv-typing">Parv Industry is typing...</div>`);
  msgContainer.appendChild(typing);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  
  try{
    const payload = {
      chatInput: action, // main field your n8n AI Agent expects (you fixed to chatInput || payload.text)
      action: action,
      label: label,
      sessionId: getSessionId(),
      source: "website_whatsapp_ui",
      timestamp: new Date().toISOString(),
      // also send whatsapp-style payload for compatibility
      payload: { text: action, from: getSessionId() },
      text: action
    };
    
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    
    let data;
    const textRes = await res.text();
    try{ data = JSON.parse(textRes); } catch{ data = { output: textRes }; }
    
    typing.remove();
    
    // Parse n8n response - supports multiple formats
    let botText = data.output || data.response || data.text || data.message || data.reply || '';
    let buttons = data.buttons || data.quickReplies || data.options || null;
    let pdfs = data.pdfs || data.catalogues || data.files || null;
    let summary = data.summary || null;
    
    // If your AI Agent sends catalogue + price list as in STEP 2
    if(!pdfs && (botText.toLowerCase().includes('catalogue') || botText.toLowerCase().includes('price list'))){
      // optional: auto-detect PDF URLs in text
      const urls = botText.match(/https?:\/\/[^\s]+\.pdf/gi);
      if(urls){
        pdfs = urls.map(u=>({url:u, name: u.includes('Price')?'Parv-Industry-Price-List.pdf':'Parv-Industry-Catalogue.pdf'}));
      }
    }
    
    // STEP 3 categories fallback if no buttons but text mentions categories
    if(!buttons && botText.toLowerCase().includes('select the product category')){
      buttons = [
        {id:'loose_spices', label:'Loose Spices'},
        {id:'fancy_box', label:'Fancy Box'},
        {id:'hanger', label:'Hanger'},
        {id:'noodles', label:'Noodles'},
        {id:'coconut_water', label:'Coconut Water'}
      ];
    }
    // STEP 5 summary fallback
    if(!buttons && botText.toLowerCase().includes('review your enquiry')){
      buttons = [
        {id:'confirm', label:'Confirm'},
        {id:'edit', label:'Edit'}
      ];
    }
    // STEP 7 main menu
    if(botText.toLowerCase().includes('representative will contact')){
      buttons = [{id:'main_menu', label:'Main Menu'}];
    }
    // STEP 1 initial buttons
    if(botText.toLowerCase().includes('welcome to parv industry') && !buttons){
      buttons = [
        {id:'catalogue', label:'Show Catalogue'},
        {id:'price_list', label:'Show Product Price List'}
      ];
    }
    
    if(!botText && !buttons && !pdfs){
      botText = "I'm here to help with Parv Industry products. Please choose an option to continue.";
      buttons = [{id:'catalogue', label:'Show Catalogue'}, {id:'price_list', label:'Show Product Price List'}];
    }
    
    renderMessage(msgContainer, botText, false, buttons, pdfs, summary);
    chatHistory.push({role:'bot', text:botText, buttons, pdfs});
    
  }catch(e){
    typing.remove();
    console.error(e);
    renderMessage(msgContainer, "Sorry, couldn't connect to Parv Industry. Please try again. If issue persists, contact us on WhatsApp.", false, [{id:'main_menu', label:'Main Menu'}]);
  }
}

function buildUI(){
  injectStyles();
  if(document.getElementById('parv-chat-root')) return;
  const root = document.createElement('div');
  root.id='parv-chat-root';
  root.innerHTML = `
    <div id="parv-chat-window">
      <div id="parv-chat-header">
        <div class="logo">PI</div>
        <div>
          <div class="title">Parv Industry <span style="font-size:10px;background:#00A884;padding:2px 6px;border-radius:10px;margin-left:6px">Business Account</span></div>
          <div class="sub">WhatsApp Product Enquiry Chatbot</div>
        </div>
        <div class="close" id="parv-close">×</div>
      </div>
      <div id="parv-chat-messages"></div>
      <div id="parv-chat-input-area">
        <input id="parv-chat-input" placeholder="Message" />
        <button id="parv-chat-send"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>
      </div>
    </div>
    <button id="parv-chat-btn" aria-label="Chat"><svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 0 0-9.95 9h11.64a1 1 0 0 1 .78.37l.01.01.02.02a1 1 0 0 1 .17.23l.01.02a1 1 0 0 1 .06.21l.01.04a1 1 0 0 1 0 .12V13a1 1 0 0 1-.29.71A1 1 0 0 1 13 14H2.05A10 10 0 1 0 12 2zm-3.5 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/></svg></button>
  `;
  document.body.appendChild(root);
  
  const btn = document.getElementById('parv-chat-btn');
  const win = document.getElementById('parv-chat-window');
  const close = document.getElementById('parv-close');
  const messages = document.getElementById('parv-chat-messages');
  const input = document.getElementById('parv-chat-input');
  const send = document.getElementById('parv-chat-send');
  
  function toggle(open){
    const shouldOpen = open!==undefined ? open : !win.classList.contains('open');
    win.classList.toggle('open', shouldOpen);
    if(shouldOpen && messages.children.length===0){
      // STEP 1 - initial welcome
      sendToN8n('Hi', 'Hi');
    }
  }
  
  btn.addEventListener('click', ()=>toggle());
  close.addEventListener('click', ()=>toggle(false));
  
  function doSend(){
    const val = input.value.trim();
    if(!val) return;
    renderMessage(messages, val, true);
    input.value='';
    sendToN8n(val, val, false);
  }
  send.addEventListener('click', doSend);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); doSend(); } });
  
  // expose for debug
  window.ParvChat = {
    open: ()=>toggle(true),
    close: ()=>toggle(false),
    send: (txt)=>{ renderMessage(messages, txt, true); sendToN8n(txt, txt); }
  };
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', buildUI);
else buildUI();

})();

