
(function(){
  var s=document.currentScript;
  var HOOK=s&&s.dataset.webhook?s.dataset.webhook:'https://n8n.propwiseai.in/webhook/website%20chatbot';
  var botName='Parv Industries';
  if(document.getElementById('parv-finder-root')) return;

  // PERSISTENT session - CRITICAL FIX
  var SID_KEY='parv_sid_desktop_v5';
  var SESSION_ID=localStorage.getItem(SID_KEY);
  if(!SESSION_ID){ SESSION_ID='parv_desktop_'+Date.now(); localStorage.setItem(SID_KEY, SESSION_ID); }

  var css=document.createElement('style');
  css.textContent=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    #parv-finder-root{position:fixed;inset:0;z-index:9999999;background:#fcfcff;font-family:Inter,sans-serif;display:flex;overflow:hidden}
    #parv-finder-root *{box-sizing:border-box;font-family:Inter,sans-serif}
    .pf-sidebar{width:280px;background:#fff;border-right:1px solid #e8e8ef;display:flex;flex-direction:column;flex-shrink:0;transition:all .3s}
    .pf-sidebar.collapsed{width:0;border-right:none;transform:translateX(-100%);opacity:0;overflow:hidden}
    .pf-side-top{padding:18px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #f0f0f5}
    .pf-logo{font-weight:700;font-size:16px;color:#4f46e5}
    .pf-toggle{width:32px;height:32px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;display:grid;place-items:center;cursor:pointer}
    .pf-new-btn{margin:16px;background:#4f46e5;color:#fff;border:none;border-radius:12px;padding:12px 16px;font-weight:600;font-size:14px;cursor:pointer}
    .pf-recent-label{font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:.08em;padding:16px 16px 8px}
    .pf-recent-item{margin:4px 12px;padding:10px 12px;border-radius:10px;cursor:pointer;border:1px solid transparent}
    .pf-recent-item.active{background:#eef2ff;border-color:#c7d2fe}
    .pf-recent-item:hover{background:#f5f3ff}
    .pf-recent-title{font-size:13px;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pf-recent-sub{font-size:11px;color:#6b7280;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pf-side-bottom{margin-top:auto;padding:12px 16px;border-top:1px solid #f0f0f5;display:flex;align-items:center;gap:10px}
    .pf-avatar{width:32px;height:32px;border-radius:50%;background:#4f46e5;color:#fff;display:grid;place-items:center;font-weight:600;font-size:12px}
    .pf-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:radial-gradient(1200px 600px at 50% -10%, #eef2ff 0%, #fcfcff 50%, #fff 100%)}
    .pf-topbar{height:56px;background:#fff;border-bottom:1px solid #eeeefa;display:flex;align-items:center;gap:12px;padding:0 16px;flex-shrink:0}
    .pf-hamburger{width:36px;height:36px;border-radius:10px;border:1px solid #e5e7eb;background:#fff;display:grid;place-items:center;cursor:pointer}
    .pf-hamburger.hidden{display:none}
    .pf-center{flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:20px}
    .pf-heading{font-size:40px;font-weight:800;line-height:1.15;text-align:center;max-width:640px;color:#0f172a;margin-top:40px}
    .pf-sub{margin-top:12px;font-size:15px;color:#64748b;text-align:center;max-width:560px}
    .pf-search-wrap{width:100%;max-width:680px;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:8px 8px 8px 16px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 30px rgba(0,0,0,.06)}
    .pf-search-wrap:focus-within{border-color:#4f46e5;box-shadow:0 0 0 4px rgba(79,70,229,.12)}
    .pf-icon-btn{width:36px;height:36px;border-radius:10px;background:#f8fafc;border:none;display:grid;place-items:center;cursor:pointer;color:#64748b;flex-shrink:0}
    .pf-input{flex:1;border:none;outline:none;font-size:14px;color:#0f172a;background:transparent}
    .pf-send{background:#4f46e5;width:40px;height:40px;border-radius:12px;border:none;color:#fff;display:grid;place-items:center;cursor:pointer}
    .pf-chips-grid{margin-top:20px;width:100%;max-width:680px;display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .pf-chip-card{border-radius:14px;padding:16px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid rgba(0,0,0,.04);text-align:left}
    .pf-chip-pink{background:#fdf2ff}.pf-chip-blue{background:#eff6ff}.pf-chip-yellow{background:#fefce8}.pf-chip-red{background:#fef2f2}
    .pf-chat-area{width:100%;max-width:760px;margin-top:20px;display:flex;flex-direction:column;gap:14px;padding-bottom:20px;display:none}
    .pf-msg{padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.6;max-width:82%;white-space:pre-wrap;word-wrap:break-word}
    .pf-msg.user{background:#111827;color:#fff;align-self:flex-end;border-bottom-right-radius:6px;margin-left:auto}
    .pf-msg.bot{background:#fff;border:1px solid #e5e7eb;color:#111827;align-self:flex-start;border-bottom-left-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .pf-typing{display:flex;gap:4px;padding:14px 16px;background:#fff;border:1px solid #e5e7eb;border-radius:18px;width:fit-content}
    .pf-dot{width:6px;height:6px;background:#111827;border-radius:50%;animation:pf-b 1.2s infinite}
    .pf-dot:nth-child(2){animation-delay:.15s}.pf-dot:nth-child(3){animation-delay:.3s}
    @keyframes pf-b{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}
    .pf-bottom-bar{padding:16px 24px;background:rgba(252,252,255,.95);backdrop-filter:blur(10px);border-top:1px solid #eeeefa;display:flex;justify-content:center;flex-shrink:0}
    .pf-wa{position:fixed;right:20px;bottom:90px;width:52px;height:52px;border-radius:50%;background:#25d366;color:#fff;border:none;display:grid;place-items:center;box-shadow:0 8px 24px rgba(37,211,102,.4);cursor:pointer;font-weight:700}
    @media(max-width:900px){.pf-sidebar{position:absolute;z-index:20;height:100%;box-shadow:4px 0 24px rgba(0,0,0,.1)}.pf-sidebar.collapsed{width:280px;transform:translateX(-100%);opacity:1}}
  `;
  document.head.appendChild(css);

  var root=document.createElement('div'); root.id='parv-finder-root';
  root.innerHTML=`
    <div class="pf-sidebar" id="pfSidebar">
      <div class="pf-side-top"><div class="pf-logo">Parv Industries</div><button class="pf-toggle" id="pfCloseSidebar">‹</button></div>
      <button class="pf-new-btn" id="pfNewBtn">+ New Search</button>
      <div class="pf-recent-label">RECENT SEARCHES</div>
      <div id="pfRecentList" style="flex:1;overflow:auto">
        <div class="pf-recent-item active" data-q="Spices List"><div class="pf-recent-title">Spices List</div><div class="pf-recent-sub">Looking for 25kg packs, 1000kg MOQ</div></div>
        <div class="pf-recent-item" data-q="Coconut Water"><div class="pf-recent-title">Coconut Water Export</div><div class="pf-recent-sub">200ml x 48 pieces inquiry</div></div>
        <div class="pf-recent-item" data-q="Noodles"><div class="pf-recent-title">Noodles Distributor</div><div class="pf-recent-sub">45g x 96, ₹500 carton</div></div>
      </div>
      <div class="pf-side-bottom"><div class="pf-avatar">U</div><div><div style="font-size:13px;font-weight:600">User</div><div style="font-size:11px;color:#6b7280">Free</div></div></div>
    </div>
    <div class="pf-main">
      <div class="pf-topbar">
        <button class="pf-hamburger hidden" id="pfOpenSidebar">☰</button>
        <div style="font-weight:600;font-size:14px">Parv Industries ▾</div>
        <div style="flex:1"></div>
        <button style="width:36px;height:36px;border-radius:10px;background:#4f46e5;color:#fff;border:none;display:grid;place-items:center;cursor:pointer" id="pfCloseRoot">✕</button>
      </div>
      <div class="pf-center" id="pfCenter">
        <div id="pfHero" style="width:100%;display:flex;flex-direction:column;align-items:center">
          <div class="pf-heading">What type of product would you like to explore?</div>
          <div class="pf-sub">Search by product, quantity, price, or let AI help you find your perfect match</div>
          <div style="height:24px"></div>
          <div class="pf-chips-grid" id="pfChipsGrid">
            <button class="pf-chip-card pf-chip-pink" data-q="Spices List">🌶 Spices List</button>
            <button class="pf-chip-card pf-chip-blue" data-q="Coconut Water">🥥 Coconut Water</button>
            <button class="pf-chip-card pf-chip-yellow" data-q="Noodles">🍜 Noodles</button>
            <button class="pf-chip-card pf-chip-red" data-q="Bulk Quote">📦 Bulk Quote</button>
          </div>
        </div>
        <div class="pf-chat-area" id="pfChatArea"></div>
      </div>
      <div class="pf-bottom-bar">
        <div class="pf-search-wrap">
          <button class="pf-icon-btn">📎</button>
          <button class="pf-icon-btn">⚙</button>
          <input class="pf-input" id="pfInput" placeholder="Ask about spices, bulk orders..." autocomplete="off"/>
          <button class="pf-icon-btn">🎤</button>
          <button class="pf-send" id="pfSendBtn">➤</button>
        </div>
      </div>
      <button class="pf-wa" onclick="window.open('https://wa.me/919999999999','_blank')">W</button>
    </div>
  `;
  document.body.appendChild(root);

  var sidebar=document.getElementById('pfSidebar');
  var openBtn=document.getElementById('pfOpenSidebar');
  var closeBtn=document.getElementById('pfCloseSidebar');
  function setSidebar(open){ if(open){ sidebar.classList.remove('collapsed'); openBtn.classList.add('hidden'); } else { sidebar.classList.add('collapsed'); openBtn.classList.remove('hidden'); } }
  closeBtn.onclick=function(){ setSidebar(false); };
  openBtn.onclick=function(){ setSidebar(true); };

  var input=document.getElementById('pfInput');
  var sendBtn=document.getElementById('pfSendBtn');
  var chatArea=document.getElementById('pfChatArea');
  var hero=document.getElementById('pfHero');
  var recentList=document.getElementById('pfRecentList');
  var center=document.getElementById('pfCenter');

  function newSearch(){
    hero.style.display='flex'; chatArea.style.display='none'; chatArea.innerHTML=''; input.value=''; input.focus();
    document.querySelectorAll('.pf-recent-item').forEach(function(i){i.classList.remove('active')});
    // NEW SEARCH = new session (like old chatbot does)
    SESSION_ID='parv_desktop_'+Date.now();
    localStorage.setItem(SID_KEY, SESSION_ID);
    console.log('New session:', SESSION_ID);
  }
  document.getElementById('pfNewBtn').onclick=newSearch;
  document.getElementById('pfCloseRoot').onclick=function(){ root.remove(); css.remove(); };
  recentList.onclick=function(e){ var item=e.target.closest('.pf-recent-item'); if(!item) return; document.querySelectorAll('.pf-recent-item').forEach(function(i){i.classList.remove('active')}); item.classList.add('active'); doSearch(item.dataset.q); };
  document.getElementById('pfChipsGrid').onclick=function(e){ var b=e.target.closest('button'); if(!b) return; doSearch(b.dataset.q); };

  function doSearch(text){
    if(!text.trim()) return;
    hero.style.display='none';
    chatArea.style.display='flex';
    var userDiv=document.createElement('div'); userDiv.className='pf-msg user'; userDiv.textContent=text; chatArea.appendChild(userDiv);
    input.value='';
    var typing=document.createElement('div'); typing.className='pf-typing'; typing.innerHTML='<div class="pf-dot"></div><div class="pf-dot"></div><div class="pf-dot"></div>'; chatArea.appendChild(typing);
    center.scrollTop=center.scrollHeight;

    var payload = {
      chatInput: text,
      message: text,
      text: text,
      sessionId: SESSION_ID,
      botName: botName
    };
    console.log('Sending to n8n:', payload);

    fetch(HOOK, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(r){ return r.text(); }).then(function(reply){
      console.log('n8n raw reply:', reply);
      try{
        var d=JSON.parse(reply);
        if(Array.isArray(d) && d[0]){ reply = d[0].output || d[0].text || d[0].message || d[0].response || reply; }
        else { reply = d.output || d.text || d.message || d.response || d.reply || reply; }
      }catch(e){}
      if(!reply || reply.trim()==='' || reply==='{}' || reply==='[]'){ reply='Thanks for reaching out! Our team will get back to you shortly.'; }
      typing.remove();
      var bot=document.createElement('div'); bot.className='pf-msg bot'; bot.innerHTML=reply.replace(/\n/g,'<br>'); chatArea.appendChild(bot);
      var newItem=document.createElement('div'); newItem.className='pf-recent-item'; newItem.dataset.q=text; newItem.innerHTML='<div class="pf-recent-title">'+text.slice(0,24)+'</div><div class="pf-recent-sub">'+reply.slice(0,38).replace(/<[^>]*>/g,'')+'...</div>'; recentList.prepend(newItem);
      center.scrollTop=center.scrollHeight; input.focus();
    }).catch(function(err){
      typing.remove();
      var errDiv=document.createElement('div'); errDiv.className='pf-msg bot'; errDiv.textContent='Cannot reach server: '+err.message+'. Make sure n8n workflow is ACTIVE.'; chatArea.appendChild(errDiv);
    });
  }

  sendBtn.onclick=function(){ doSearch(input.value); };
  input.onkeydown=function(e){ if(e.key==='Enter'){ doSearch(input.value); } };
  input.focus();
})();
