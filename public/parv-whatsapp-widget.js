(function(){
  var s=document.currentScript;
  var HOOK=s&&s.dataset.webhook?s.dataset.webhook:'https://n8n.propwiseai.in/webhook/website%20chatbot';
  var botName='Parv Industries';
  if(document.getElementById('parv-finder-root')) return;

  var SID_KEY='parv_sid_v10_centered';
  var SESSION_ID=localStorage.getItem(SID_KEY);
  if(!SESSION_ID){ SESSION_ID='parv_desktop_'+Date.now(); localStorage.setItem(SID_KEY, SESSION_ID); }

  var RECENT_KEY='parv_recent_v10';
  var defaultRecents=[
    {title:'Spices List', sub:'25kg packs, 1000kg MOQ', q:'Spices List', archived:false},
    {title:'Coconut Water', sub:'200ml x 48 pieces', q:'Coconut Water', archived:false},
    {title:'Noodles', sub:'45g x 96, ₹500 carton', q:'Noodles', archived:false}
  ];

  var css=document.createElement('style');
  css.textContent=`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600&display=swap');
    #parv-finder-root{position:fixed;inset:0;z-index:9999999;background:#FFFEFB;font-family:'Outfit',sans-serif;display:flex;overflow:hidden}
    #parv-finder-root *{box-sizing:border-box;font-family:'Outfit',sans-serif}
    .pf-sidebar{width:280px;background:#FFFEFB;border-right:1px solid rgba(0,0,0,.07);display:flex;flex-direction:column;flex-shrink:0;transition:all .35s cubic-bezier(.16,1,.3,1)}
    .pf-sidebar.collapsed{width:0;border-right:none;transform:translateX(-100%);opacity:0;overflow:hidden}
    .pf-side-top{padding:18px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,0,0,.07)}
    .pf-logo{font-family:'Fraunces',serif;font-weight:700;font-size:18px;color:#8B1E1E}
    .pf-logo span{font-weight:400;font-size:11px;color:#6B7280;display:block}
    .pf-toggle{width:32px;height:32px;border-radius:50%;border:1px solid rgba(0,0,0,.08);background:#F6F3EE;display:grid;place-items:center;cursor:pointer;color:#8B1E1E}
    .pf-new-btn{margin:16px;background:#8B1E1E;color:#FFFEFB;border:none;border-radius:100px;padding:12px 16px;font-weight:600;font-size:13px;cursor:pointer}
    .pf-recent-header{display:flex;align-items:center;justify-content:space-between;padding:16px 16px 8px}
    .pf-recent-label{font-size:11px;font-weight:600;color:#9CA3AF;letter-spacing:.1em}
    .pf-clear-btn{font-size:11px;font-weight:600;color:#8B1E1E;background:transparent;border:none;cursor:pointer;padding:4px 8px;border-radius:6px}
    .pf-clear-btn:hover{background:#F6F3EE}
    .pf-recent-list{flex:1;overflow:auto;padding-bottom:8px}
    .pf-recent-item{margin:6px 12px;padding:10px 12px;border-radius:12px;border:1px solid rgba(0,0,0,.06);display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;cursor:pointer}
    .pf-recent-item.active{background:#F6F3EE;border-color:rgba(139,30,30,.12)}
    .pf-recent-item.archived{opacity:.6;background:#f3f4f6;border-style:dashed}
    .pf-recent-main{flex:1;min-width:0}
    .pf-recent-title{font-size:13px;font-weight:600;color:#1F1F1F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pf-recent-sub{font-size:11px;color:#6B7280;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .pf-recent-actions{display:flex;gap:6px;flex-shrink:0}
    .pf-action-btn{width:28px;height:28px;border-radius:8px;border:1px solid rgba(0,0,0,.1);background:#FFFEFB;display:grid;place-items:center;cursor:pointer;font-size:14px;transition:.15s}
    .pf-action-btn:hover{background:#1F1F1F;color:#fff}
    .pf-action-btn.del:hover{background:#DC2626;border-color:#DC2626;color:#fff}
    .pf-side-bottom{margin-top:auto;padding:12px 16px;border-top:1px solid rgba(0,0,0,.07);display:flex;align-items:center;gap:10px;background:#FFFEFB;cursor:pointer;position:relative}
    .pf-avatar{width:32px;height:32px;border-radius:50%;background:#8B1E1E;color:#FFFEFB;display:grid;place-items:center;font-weight:600;font-size:12px;font-family:'Fraunces',serif;flex-shrink:0}
    .pf-user-info{flex:1;min-width:0}
    .pf-user-name{font-size:13px;font-weight:600;color:#1F1F1F}
    .pf-user-plan{font-size:11px;color:#6B7280}
    .pf-user-chevron{font-size:12px;color:#9CA3AF;transition:.2s}
    .pf-side-bottom.open .pf-user-chevron{transform:rotate(180deg)}
    .pf-user-menu{position:absolute;bottom:100%;left:12px;right:12px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.12);overflow:hidden;display:none;z-index:100;margin-bottom:8px}
    .pf-user-menu.open{display:block}
    .pf-menu-item{padding:12px 14px;display:flex;align-items:center;gap:10px;font-size:13px;color:#1F1F1F;cursor:pointer}
    .pf-menu-item:hover{background:#F6F3EE}
    .pf-menu-item .ico{width:20px;display:grid;place-items:center;color:#6B7280}
    .pf-menu-divider{height:1px;background:rgba(0,0,0,.06);margin:0}
    .pf-menu-email{padding:12px 14px;font-size:13px;color:#1F1F1F;border-bottom:1px solid rgba(0,0,0,.06);display:flex;align-items:center;gap:10px;background:#FFFEFB}
    .pf-main{flex:1;display:flex;flex-direction:column;overflow:hidden;background:#FFFEFB;position:relative}
    .pf-main::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.35;background-image:linear-gradient(rgba(0,0,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 1px);background-size:28px 28px}
    .pf-topbar{height:64px;background:rgba(255,254,251,.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.07);display:flex;align-items:center;gap:12px;padding:0 20px;flex-shrink:0;position:relative;z-index:2}
    .pf-topbar-logo{font-family:'Fraunces',serif;font-weight:700;font-size:20px;color:#8B1E1E;letter-spacing:.02em}
    .pf-topbar-sub{font-size:11px;color:#6B7280;letter-spacing:.04em;margin-top:-2px}
    .pf-hamburger{width:36px;height:36px;border-radius:10px;border:1px solid rgba(0,0,0,.08);background:#F6F3EE;display:grid;place-items:center;cursor:pointer;color:#1F1F1F}
    .pf-hamburger.hidden{display:none}
    .pf-center{flex:1;overflow:auto;display:flex;flex-direction:column;align-items:center;padding:24px 20px;position:relative;z-index:1}
    .pf-kicker{font-size:12px;font-weight:600;letter-spacing:.14em;color:#8B1E1E;text-transform:uppercase;margin-bottom:16px}
    .pf-heading{font-family:'Fraunces',serif;font-size:48px;font-weight:700;line-height:1.05;letter-spacing:-.02em;text-align:center;max-width:640px;color:#1F1F1F;margin-top:8px}
    .pf-heading em{font-style:italic;font-weight:600;color:#8B1E1E}
    .pf-sub{margin-top:16px;font-size:15px;color:#6B7280;text-align:center;max-width:520px;line-height:1.6}
    .pf-chips-grid{margin-top:28px;width:100%;max-width:680px;display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;z-index:1}
    .pf-chip-card{border-radius:16px;padding:16px 18px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid rgba(0,0,0,.06);text-align:left;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .pf-chat-area{width:100%;max-width:760px;margin-top:24px;display:flex;flex-direction:column;gap:16px;padding-bottom:24px;display:none;position:relative;z-index:1}
    .pf-msg{padding:12px 16px;border-radius:20px;font-size:14px;line-height:1.6;max-width:82%;white-space:pre-wrap;word-wrap:break-word}
    .pf-msg.user{background:#1F1F1F;color:#FFFEFB;align-self:flex-end;border-bottom-right-radius:6px;margin-left:auto}
    .pf-msg.bot{background:#fff;border:1px solid rgba(0,0,0,.07);color:#1F1F1F;align-self:flex-start;border-bottom-left-radius:6px;box-shadow:0 2px 12px rgba(0,0,0,.06);margin-right:auto}
    .pf-typing{display:flex;gap:4px;padding:14px 18px;background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:20px;border-bottom-left-radius:6px;width:fit-content}
    .pf-dot{width:6px;height:6px;background:#8B1E1E;border-radius:50%;animation:pf-b 1.2s infinite}
    .pf-dot:nth-child(2){animation-delay:.15s}.pf-dot:nth-child(3){animation-delay:.3s}
    @keyframes pf-b{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}
    /* FIXED ALIGNMENT - CENTERED PERFECTLY */
    .pf-bottom-bar{height:80px;padding:0 20px;background:rgba(255,254,251,.98);backdrop-filter:blur(14px);border-top:1px solid rgba(0,0,0,.07);display:flex;justify-content:center;align-items:center;flex-shrink:0;position:relative;z-index:2;width:100%}
    .pf-bottom-inner{width:100%;max-width:760px;display:flex;justify-content:center;align-items:center;margin:0 auto}
    .pf-search-wrap{width:100%;max-width:680px;height:52px;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:100px;padding:0 6px 0 12px;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,.06);transition:.2s;margin:0 auto}
    .pf-search-wrap:focus-within{border-color:#8B1E1E;box-shadow:0 0 0 4px rgba(139,30,30,.1),0 4px 20px rgba(0,0,0,.06)}
    .pf-icon-btn{width:36px;height:36px;border-radius:50%;background:#F6F3EE;border:1px solid rgba(0,0,0,.06);display:grid;place-items:center;cursor:pointer;color:#6B7280;flex-shrink:0;font-size:14px}
    .pf-input{flex:1;border:none;outline:none;font-size:14px;color:#1F1F1F;background:transparent;min-width:0;height:100%;line-height:52px;padding:0 4px}
    .pf-input::placeholder{color:#9CA3AF;line-height:52px}
    .pf-send{background:#8B1E1E;width:40px;height:40px;border-radius:50%;border:none;color:#FFFEFB;display:grid;place-items:center;cursor:pointer;flex-shrink:0;box-shadow:0 2px 8px rgba(139,30,30,.25);font-size:14px}
    .pf-wa{position:fixed;right:20px;bottom:96px;width:56px;height:56px;border-radius:50%;background:#25D366;color:#fff;border:none;display:grid;place-items:center;box-shadow:0 8px 24px rgba(37,211,102,.35);cursor:pointer;z-index:5}
    .pf-wa svg{width:28px;height:28px;fill:#fff}
    .pf-cta-row{margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;position:relative;z-index:1}
    .pf-cta-primary{background:#8B1E1E;color:#FFFEFB;border:1px solid #8B1E1E;padding:12px 22px;border-radius:100px;font-size:13px;font-weight:600;letter-spacing:.02em;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
    .pf-cta-secondary{background:#fff;color:#1F1F1F;border:1px solid rgba(0,0,0,.12);padding:12px 22px;border-radius:100px;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
    @media(max-width:900px){.pf-sidebar{position:absolute;z-index:20;height:100%;box-shadow:8px 0 32px rgba(0,0,0,.12)}.pf-sidebar.collapsed{width:280px;transform:translateX(-100%);opacity:1}.pf-heading{font-size:34px}.pf-bottom-bar{height:72px;padding:0 12px}.pf-search-wrap{height:48px}.pf-input{line-height:48px}.pf-input::placeholder{line-height:48px}}
  `;
  document.head.appendChild(css);

  function loadRecents(){ try{ var s=JSON.parse(localStorage.getItem(RECENT_KEY)); if(Array.isArray(s)&&s.length) return s; }catch(e){} return JSON.parse(JSON.stringify(defaultRecents)); }
  function saveRecents(l){ localStorage.setItem(RECENT_KEY, JSON.stringify(l)); }
  var recents=loadRecents();

  var root=document.createElement('div'); root.id='parv-finder-root';
  root.innerHTML=`
    <div class="pf-sidebar" id="pfSidebar">
      <div class="pf-side-top"><div class="pf-logo">PARV<span>INDUSTRIES</span></div><button class="pf-toggle" id="pfCloseSidebar">‹</button></div>
      <button class="pf-new-btn" id="pfNewBtn">+ New Search</button>
      <div class="pf-recent-header"><div class="pf-recent-label">RECENT SEARCHES</div><button class="pf-clear-btn" id="pfClearBtn">Clear</button></div>
      <div class="pf-recent-list" id="pfRecentList"></div>
      <div class="pf-side-bottom" id="pfUserBtn">
        <div class="pf-avatar">U</div>
        <div class="pf-user-info"><div class="pf-user-name">User</div><div class="pf-user-plan">Free</div></div>
        <div class="pf-user-chevron">∧</div>
        <div class="pf-user-menu" id="pfUserMenu">
          <div class="pf-menu-email"><span class="ico">👤</span> user@example.com</div>
          <div class="pf-menu-item" data-action="upgrade"><span class="ico">✨</span> Upgrade plan</div>
          <div class="pf-menu-divider"></div>
          <div class="pf-menu-item" data-action="settings"><span class="ico">⚙️</span> Settings</div>
          <div class="pf-menu-item" data-action="help"><span class="ico">❓</span> Help</div>
          <div class="pf-menu-divider"></div>
          <div class="pf-menu-item" data-action="logout"><span class="ico">⎋</span> Log out</div>
        </div>
      </div>
    </div>
    <div class="pf-main">
      <div class="pf-topbar">
        <button class="pf-hamburger hidden" id="pfOpenSidebar">☰</button>
        <div style="display:flex;flex-direction:column"><div class="pf-topbar-logo">PARV INDUSTRIES</div><div class="pf-topbar-sub">A subsidiary of Chakshu Food Pvt. Ltd.</div></div>
        <div style="flex:1"></div>
        <a href="https://www.parvindustries.in" target="_blank" style="background:#8B1E1E;color:#FFFEFB;border:none;border-radius:100px;padding:10px 18px;font-size:12px;font-weight:600;letter-spacing:.02em;display:flex;align-items:center;gap:6px;cursor:pointer;text-decoration:none">REQUEST A QUOTE ↗</a>
        <button style="width:36px;height:36px;border-radius:50%;background:#F6F3EE;border:1px solid rgba(0,0,0,.08);display:grid;place-items:center;cursor:pointer;margin-left:8px" id="pfCloseRoot">✕</button>
      </div>
      <div class="pf-center" id="pfCenter">
        <div id="pfHero" style="width:100%;display:flex;flex-direction:column;align-items:center">
          <div class="pf-kicker">Food Manufacturing for Modern Markets</div>
          <div class="pf-heading">Good food<br>begins with<br><em>good intent.</em></div>
          <div class="pf-sub">Parv Industries makes and supplies spices, coconut water, noodles, and bulk ingredients for the businesses that keep India moving.</div>
          <div class="pf-cta-row">
            <button class="pf-cta-primary" id="pfExploreBtn">EXPLORE PRODUCTS ↗</button>
            <button class="pf-cta-secondary" id="pfBulkBtn">REQUEST BULK QUOTE ↗</button>
          </div>
          <div style="height:28px"></div>
          <div class="pf-chips-grid" id="pfChipsGrid">
            <button class="pf-chip-card" data-q="Spices List">🌶 Spices List — 25kg Pack, 1000kg MOQ</button>
            <button class="pf-chip-card" data-q="Coconut Water">🥥 Pure Coconut Water 200ml x 48</button>
            <button class="pf-chip-card" data-q="Noodles">🍜 Eurofresh Noodles 45g x 96 - ₹500</button>
            <button class="pf-chip-card" data-q="Bulk Quote">📦 Bulk Quote for Export Order</button>
          </div>
        </div>
        <div class="pf-chat-area" id="pfChatArea"></div>
      </div>
      <div class="pf-bottom-bar">
        <div class="pf-bottom-inner">
          <div class="pf-search-wrap">
            <button class="pf-icon-btn" title="Attach">📎</button>
            <button class="pf-icon-btn" title="Settings">⚙</button>
            <input class="pf-input" id="pfInput" placeholder="Ask about spices, bulk orders..." autocomplete="off"/>
            <button class="pf-icon-btn" title="Mic">🎤</button>
            <button class="pf-send" id="pfSendBtn">➤</button>
          </div>
        </div>
      </div>
      <button class="pf-wa" id="pfWaBtn" title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.11 4.64A9.86 9.86 0 0 0 12.04 2C6.24 2 1.5 6.73 1.5 12.53c0 1.86.49 3.67 1.42 5.27L1.5 22.5l4.82-1.26a9.8 9.8 0 0 0 4.68 1.19h.01c5.8 0 10.53-4.73 10.53-10.53 0-2.81-1.09-5.46-3.09-7.45l.46-.81zM12.05 20.33a8.05 8.05 0 0 1-4.1-1.12l-.29-.17-2.86.75.76-2.79-.19-.29a8.02 8.02 0 0 1-1.24-4.18c0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36a8 8 0 0 1 2.36 5.69c0 4.44-3.61 8.05-8.04 8.05zm4.41-5.98c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.39.12-.13.16-.22.24-.37.08-.14.04-.27-.02-.39-.06-.12-.54-1.3-.74-1.78-.2-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.27-.22.22-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.57.18 1.09.16 1.5.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(root);

  var sidebar=document.getElementById('pfSidebar');
  var openBtn=document.getElementById('pfOpenSidebar');
  var closeBtn=document.getElementById('pfCloseSidebar');
  function setSidebar(open){ if(open){ sidebar.classList.remove('collapsed'); openBtn.classList.add('hidden'); localStorage.setItem('parv_sidebar_v10','open'); } else { sidebar.classList.add('collapsed'); openBtn.classList.remove('hidden'); localStorage.setItem('parv_sidebar_v10','closed'); } }
  closeBtn.onclick=function(){ setSidebar(false); };
  openBtn.onclick=function(){ setSidebar(true); };
  if(localStorage.getItem('parv_sidebar_v10')==='closed') setSidebar(false);

  var input=document.getElementById('pfInput');
  var sendBtn=document.getElementById('pfSendBtn');
  var chatArea=document.getElementById('pfChatArea');
  var hero=document.getElementById('pfHero');
  var recentList=document.getElementById('pfRecentList');
  var center=document.getElementById('pfCenter');

  function renderRecents(){
    recentList.innerHTML='';
    if(recents.length===0){ var empty=document.createElement('div'); empty.style.cssText='padding:12px 16px;color:#9CA3AF;font-size:12px;text-align:center'; empty.textContent='No recent searches'; recentList.appendChild(empty); return; }
    recents.forEach(function(item, idx){
      var div=document.createElement('div');
      div.className='pf-recent-item'+(idx===0?' active':'')+(item.archived?' archived':'');
      div.dataset.q=item.q; div.dataset.idx=idx;
      div.innerHTML='<div class="pf-recent-main"><div class="pf-recent-title">'+item.title+'</div><div class="pf-recent-sub">'+item.sub+'</div></div><div class="pf-recent-actions"><button class="pf-action-btn archive" title="Archive chat">📦</button><button class="pf-action-btn del" title="Delete chat">🗑️</button></div>';
      recentList.appendChild(div);
    });
  }
  renderRecents();

  function newSearch(){ hero.style.display='flex'; chatArea.style.display='none'; chatArea.innerHTML=''; input.value=''; input.focus(); document.querySelectorAll('.pf-recent-item').forEach(function(i){i.classList.remove('active')}); SESSION_ID='parv_desktop_'+Date.now(); localStorage.setItem(SID_KEY, SESSION_ID); }
  document.getElementById('pfNewBtn').onclick=newSearch;
  document.getElementById('pfCloseRoot').onclick=function(){ root.remove(); css.remove(); };
  document.getElementById('pfClearBtn').onclick=function(){ recents=[]; saveRecents(recents); renderRecents(); };
  recentList.onclick=function(e){
    var del=e.target.closest('.pf-action-btn.del');
    var arch=e.target.closest('.pf-action-btn.archive');
    var item=e.target.closest('.pf-recent-item');
    if(!item) return;
    var idx=parseInt(item.dataset.idx);
    if(del){ e.stopPropagation(); recents.splice(idx,1); saveRecents(recents); renderRecents(); return; }
    if(arch){ e.stopPropagation(); recents[idx].archived=!recents[idx].archived; saveRecents(recents); renderRecents(); return; }
    if(e.target.closest('.pf-recent-main')){ document.querySelectorAll('.pf-recent-item').forEach(function(i){i.classList.remove('active')}); item.classList.add('active'); doSearch(item.dataset.q); }
  };

  var userBtn=document.getElementById('pfUserBtn');
  var userMenu=document.getElementById('pfUserMenu');
  userBtn.onclick=function(e){ if(e.target.closest('.pf-action-btn')) return; userBtn.classList.toggle('open'); userMenu.classList.toggle('open'); };
  document.addEventListener('click', function(e){ if(!userBtn.contains(e.target)){ userBtn.classList.remove('open'); userMenu.classList.remove('open'); } });
  userMenu.onclick=function(e){
    var it=e.target.closest('.pf-menu-item'); if(!it) return;
    var act=it.dataset.action;
    if(act==='logout'){ localStorage.clear(); location.reload(); }
    if(act==='settings'){ doSearch('Settings'); }
    if(act==='help'){ doSearch('Help'); }
    if(act==='upgrade'){ doSearch('Upgrade plan'); }
    userMenu.classList.remove('open'); userBtn.classList.remove('open');
  };

  document.getElementById('pfWaBtn').onclick=function(){ window.open('https://wa.me/919896342940?text=Hi%20Parv%20Industries%20I%20want%20to%20inquire%20about%20bulk%20order','_blank'); };
  document.getElementById('pfExploreBtn').onclick=function(){ doSearch('Spices List'); };
  document.getElementById('pfBulkBtn').onclick=function(){ doSearch('Bulk Quote'); };
  document.getElementById('pfChipsGrid').onclick=function(e){ var b=e.target.closest('button'); if(!b) return; doSearch(b.dataset.q); };

  function doSearch(text){
    if(!text.trim()) return;
    hero.style.display='none';
    chatArea.style.display='flex';
    var userDiv=document.createElement('div'); userDiv.className='pf-msg user'; userDiv.textContent=text; chatArea.appendChild(userDiv);
    input.value='';
    var typing=document.createElement('div'); typing.className='pf-typing'; typing.innerHTML='<div class="pf-dot"></div><div class="pf-dot"></div><div class="pf-dot"></div>'; chatArea.appendChild(typing);
    center.scrollTop=center.scrollHeight;
    var payload = { chatInput: text, message: text, text: text, sessionId: SESSION_ID, botName: botName };
    fetch(HOOK, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) })
    .then(function(r){ return r.text(); }).then(function(reply){
      try{ var d=JSON.parse(reply); if(Array.isArray(d) && d[0]){ reply = d[0].output || d[0].text || d[0].message || d[0].response || reply; } else { reply = d.output || d.text || d.message || d.response || d.reply || reply; } }catch(e){}
      if(!reply || reply.trim()==='' || reply==='{}' || reply==='[]'){ reply='Thanks for reaching out! Our team will get back to you shortly.'; }
      typing.remove();
      var bot=document.createElement('div'); bot.className='pf-msg bot'; bot.innerHTML=reply.replace(/\\n/g,'<br>'); chatArea.appendChild(bot);
      recents.unshift({title:text.slice(0,22), sub:reply.slice(0,38).replace(/<[^>]*>/g,'')+'...', q:text, archived:false});
      if(recents.length>20) recents=recents.slice(0,20);
      saveRecents(recents); renderRecents();
      center.scrollTop=center.scrollHeight; input.focus();
    }).catch(function(err){ typing.remove(); var errDiv=document.createElement('div'); errDiv.className='pf-msg bot'; errDiv.textContent='Cannot reach server: '+err.message; chatArea.appendChild(errDiv); });
  }

  sendBtn.onclick=function(){ doSearch(input.value); };
  input.onkeydown=function(e){ if(e.key==='Enter'){ doSearch(input.value); } };
  input.focus();
})();
