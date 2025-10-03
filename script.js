/* script.js - full behavior:
   - long-press bottom-left (1s) reveals keypad
   - keypad layout: 1 2 3 / 4 5 6 / 7 8 9 / C 0 E
   - 8440 activates admin (title shows ✅). Does NOT display ☰.
   - 2871 toggles admin menu, but only if admin active.
   - Admin menu has many settings (all OFF by default), named backgrounds, persistence.
*/

(() => {
  /* ====== Storage & defaults ====== */
  const STORAGE_KEY = 'ledark_v4';
  const ADMIN_CODE = '8440';
  const MENU_CODE = '2871';
  const defaultState = {
    count: 0,
    maxClicks: 1000,
    redirectURL: 'https://therapy.com',
    darksPerClick: 1,
    holdToSpawn: false,
    holdSpawnTime: 800,
    fontSize: 28,
    wordSpacing: 12,
    themeOverride: null, // null = random each load
    toggles: {
      rainbowCycle: false,
      glowAura: false,
      spin: false,
      floaty: false,
      chaos: false,
      rainMode: false,
      confetti: false,
      sealMode: false,
      shakeScreen: false,
      flipText: false,
      reverseClicks: false,
      hoverCornerGlow: false
    }
  };

  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return JSON.parse(JSON.stringify(defaultState));
      const s = JSON.parse(raw);
      // shallow fill missing keys
      s.toggles = Object.assign({}, defaultState.toggles, s.toggles || {});
      return Object.assign(JSON.parse(JSON.stringify(defaultState)), s);
    } catch(e){ return JSON.parse(JSON.stringify(defaultState)); }
  }
  function saveState(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  }

  // app state
  let state = loadState();
  let adminUnlocked = false;
  let codeBuffer = '';

  /* ====== DOM refs ====== */
  const title = document.getElementById('title');
  const addDarkBtn = document.getElementById('addDarkBtn');
  const clicksLeftBtn = document.getElementById('clicksLeftBtn');
  const container = document.getElementById('container');
  const secretCorner = document.getElementById('secretCorner');
  const keypad = document.getElementById('keypad');
  const adminMessage = document.getElementById('adminMessage');
  const menuPanel = document.getElementById('menuPanel');
  const particleCanvas = document.getElementById('particleCanvas');

  /* ====== helper UI updates ====== */
  function updateClicksLeft(){
    clicksLeftBtn.textContent = `Clicks Left: ${Math.max(0, state.maxClicks - state.count)}`;
  }
  function showAdminMsg(text, ms=1500){
    adminMessage.textContent = text;
    adminMessage.classList.remove('hidden');
    setTimeout(()=> adminMessage.classList.add('hidden'), ms);
  }

  /* ====== Background themes (named) ====== */
  const THEMES = {
    'Calm Gradient': () => document.body.style.background = 'linear-gradient(135deg,#0b1020 0%, #12121b 50%, #1b1b2b 100%)',
    'Space': () => { document.body.style.background = 'radial-gradient(ellipse at bottom, #02010a 0%, #05020a 50%, #0c0820 100%)'; spawnStarsCanvas(); },
    'Matrix Code': () => document.body.style.background = 'linear-gradient(180deg,#041712,#041712)',
    'Rainbow Wave': () => { document.body.style.background = 'linear-gradient(45deg,#ff66ff,#66ffff,#ffcc66)'; document.body.style.backgroundSize='400% 400%'; document.body.style.animation='gradientBG 30s ease infinite'; },
    'Sunset': () => document.body.style.background = 'linear-gradient(135deg,#ff9a9e 0%, #fad0c4 100%)',
    'Ocean Breeze': () => document.body.style.background = 'linear-gradient(135deg,#00c9ff,#92fe9d)',
    'Vaporwave': () => document.body.style.background = 'linear-gradient(135deg,#f6d365,#fda085)',
    'Midnight': () => document.body.style.background = 'linear-gradient(135deg,#0f2027,#2c5364)'
  };

  function pickRandomTheme(){
    if(state.themeOverride) { if(THEMES[state.themeOverride]) THEMES[state.themeOverride](); return; }
    const keys = Object.keys(THEMES);
    const choice = keys[Math.floor(Math.random()*keys.length)];
    THEMES[choice]();
  }

  /* lightweight stars for space theme */
  let starCanvas, starCtx, starAnim=false;
  function spawnStarsCanvas(){
    if(starAnim) return;
    starCanvas = document.createElement('canvas');
    starCanvas.id = '__ledark_stars';
    starCanvas.style.position='fixed'; starCanvas.style.left='0'; starCanvas.style.top='0';
    starCanvas.style.width='100%'; starCanvas.style.height='100%'; starCanvas.style.zIndex='-1'; starCanvas.style.pointerEvents='none';
    document.body.appendChild(starCanvas);
    starCtx = starCanvas.getContext('2d');
    function resize(){ starCanvas.width = innerWidth; starCanvas.height = innerHeight; }
    resize(); window.addEventListener('resize', resize);
    const stars = Array.from({length: Math.min(140, Math.floor(innerWidth/7))}, ()=>({x:Math.random()*starCanvas.width,y:Math.random()*starCanvas.height,r:Math.random()*1.6+0.4, a:Math.random()}));
    let last = performance.now();
    starAnim = true;
    function tick(now){
      const dt = now-last; last=now;
      starCtx.clearRect(0,0,starCanvas.width,starCanvas.height);
      stars.forEach(s=>{
        s.a += (Math.random()*0.02 - 0.01);
        s.a = Math.max(0.12, Math.min(1, s.a));
        starCtx.beginPath(); starCtx.arc(s.x,s.y,s.r,0,Math.PI*2); starCtx.fillStyle = `rgba(255,255,255,${0.25 + 0.6*Math.sin(now/1000 + s.x)})`; starCtx.fill();
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ====== keypad (build + show/hide) ====== */
  function buildKeypad(){
    keypad.innerHTML = '';
    const display = document.createElement('div'); display.className='display'; display.id='passwordDisplay'; display.textContent='----';
    keypad.appendChild(display);
    const grid = document.createElement('div'); grid.className='key-grid';
    const keys = ['1','2','3','4','5','6','7','8','9','C','0','E']; // row-major
    keys.forEach(k=>{
      const b = document.createElement('button'); b.className='key'; b.textContent = k;
      // accessibility hint for C/E
      if(k === 'C') b.setAttribute('aria-label','Clear');
      if(k === 'E') b.setAttribute('aria-label','Enter');
      b.addEventListener('click', ()=> onKeyPress(k));
      grid.appendChild(b);
    });
    keypad.appendChild(grid);
  }
  buildKeypad();

  function showKeypad(){ keypad.classList.remove('hidden'); keypad.setAttribute('aria-hidden','false'); }
  function hideKeypad(){ keypad.classList.add('hidden'); keypad.setAttribute('aria-hidden','true'); codeBuffer = ''; updateKeypadDisplay(); }

  function updateKeypadDisplay(){ const d = document.getElementById('passwordDisplay'); if(d) d.textContent = codeBuffer.padEnd(4,'-'); }

  function onKeyPress(k){
    if(k === 'C'){ codeBuffer = ''; updateKeypadDisplay(); return; }
    if(k === 'E'){ processCode(codeBuffer); codeBuffer = ''; updateKeypadDisplay(); return; }
    if(codeBuffer.length < 4 && /^\d$/.test(k)){ codeBuffer += k; updateKeypadDisplay(); }
  }

  /* ====== secret corner long-press (bottom-left) ====== */
  let cornerTimer = null;
  function cornerPressStart(){ cornerTimer = setTimeout(()=>{ showKeypad(); }, 1000); }
  function cornerPressCancel(){ if(cornerTimer){ clearTimeout(cornerTimer); cornerTimer = null; } }
  secretCorner.addEventListener('touchstart', cornerPressStart, {passive:true});
  secretCorner.addEventListener('mousedown', cornerPressStart);
  ['mouseup','mouseleave','touchend','touchcancel'].forEach(ev => secretCorner.addEventListener(ev, cornerPressCancel));

  /* Also hide keypad if clicking elsewhere */
  document.addEventListener('click', (e) => {
    if(!keypad.classList.contains('hidden')){
      if(!keypad.contains(e.target) && e.target !== secretCorner) hideKeypad();
    }
  });

  /* ====== process codes ====== */
  function processCode(code){
    if(code === ADMIN_CODE){
      adminUnlocked = true;
      title.textContent = 'le dark ✅';
      showAdminMsg('Admin mode activated', 1500);
      // do NOT show any ☰ button (per your instruction)
      saveState();
      return;
    }
    if(code === MENU_CODE && adminUnlocked){
      // toggle menu
      menuPanel.classList.toggle('hidden');
      if(!menuPanel.classList.contains('hidden')) buildMenu();
      return;
    }
    // other cases: denied or fake codes can create secret messages (optional)
    showAdminMsg('Access Denied', 1200);
  }

  /* ====== spawn Dark (main) ====== */
  let lastSpawn = 0;
  function spawnDark(n){
    n = n || Math.max(1, state.darksPerClick || 1);
    const now = Date.now();
    // simple debounce for double taps
    if(now - lastSpawn < 60) return;
    lastSpawn = now;

    // optional reverseClicks chance
    if(state.toggles.reverseClicks && Math.random() < 0.12){
      state.count = Math.max(0, state.count - 1);
      saveState();
      updateClicksLeft();
      return;
    }

    for(let i=0;i<n;i++){
      state.count = (state.count || 0) + 1;
      const el = document.createElement('div');
      el.className = 'darkWord';
      el.textContent = state.toggles.sealMode ? '🦭' : 'Dark';
      el.style.fontSize = (state.fontSize || 28) + 'px';
      // color progression to pure black at maxClicks
      const progress = clamp(state.count / (state.maxClicks || 1000), 0, 1);
      const shade = Math.round(255 - progress * 255);
      el.style.color = `rgb(${shade},${shade},${shade})`;
      // small offset to keep spacing stable
      el.style.margin = (state.wordSpacing||12)/2 + 'px';
      // apply visuals
      applyTogglesToElement(el, true);
      container.appendChild(el);

      if(state.toggles.rainMode){
        el.classList.add('rainDrop');
        el.style.left = Math.random() * (window.innerWidth * 0.9) + 'px';
        // will be removed by animation or after duration
        setTimeout(()=> el.remove(), 4500);
      }
    }

    // confetti on chance
    if(state.toggles.confetti && Math.random() < 0.3) spawnBurst(Math.random()*window.innerWidth, 100, 12);

    // shake screen
    if(state.toggles.shakeScreen){
      document.body.style.transform = `translate(${(Math.random()*10-5)|0}px, ${(Math.random()*8-4)|0}px)`;
      setTimeout(()=> document.body.style.transform = '', 120);
    }

    // save and update UI
    saveState();
    updateClicksLeft();

    if(state.count >= state.maxClicks){
      window.location.href = state.redirectURL || 'https://therapy.com';
    }
  }

  /* Hold-to-spawn (optional) */
  let spawnHoldTimer = null;
  addDarkBtn.addEventListener('touchstart', (e)=>{
    if(state.holdToSpawn){
      spawnHoldTimer = setTimeout(()=> spawnDark(1), state.holdSpawnTime || 800);
    }
  }, {passive:true});
  addDarkBtn.addEventListener('touchend', ()=> { if(spawnHoldTimer){ clearTimeout(spawnHoldTimer); spawnHoldTimer = null; }});
  addDarkBtn.addEventListener('mousedown', ()=>{
    if(state.holdToSpawn) spawnHoldTimer = setTimeout(()=> spawnDark(1), state.holdSpawnTime || 800);
  });
  addDarkBtn.addEventListener('mouseup', ()=> { if(spawnHoldTimer){ clearTimeout(spawnHoldTimer); spawnHoldTimer=null; }});
  // normal click when holdToSpawn false
  addDarkBtn.addEventListener('click', (e)=>{
    if(state.holdToSpawn) return;
    spawnDark();
  });

  /* ====== visuals applying ====== */
  function applyTogglesToElement(el, isNew=false){
    // clear classes
    el.classList.remove('rainbow','glow','spin','floaty','chaos');
    el.style.setProperty('--r','0deg'); el.style.setProperty('--skx','0deg'); el.style.setProperty('--sky','0deg'); el.style.setProperty('--s','1');

    if(state.toggles.rainbowCycle) el.classList.add('rainbow');
    if(state.toggles.glowAura) el.classList.add('glow');
    if(state.toggles.spin) el.classList.add('spin');
    if(state.toggles.floaty) el.classList.add('floaty');
    if(state.toggles.chaos){
      el.classList.add('chaos');
      const r = (Math.random()*40-20).toFixed(2)+'deg';
      const skx = (Math.random()*10-5).toFixed(2)+'deg';
      const sky = (Math.random()*6-3).toFixed(2)+'deg';
      const s = (1 + Math.random()*0.6).toFixed(2);
      el.style.setProperty('--r', r); el.style.setProperty('--skx', skx); el.style.setProperty('--sky', sky); el.style.setProperty('--s', s);
    }
    if(state.toggles.flipText && Math.random() < 0.15) el.style.transform = (el.style.transform || '') + ' rotateX(180deg)';
    if(state.toggles.sealMode && isNew) { /* already shows seal */ }
  }

  function refreshAllWords(){
    const all = container.querySelectorAll('.darkWord');
    all.forEach(el => applyTogglesToElement(el, false));
    // spacing & font-size
    container.style.gap = (state.wordSpacing || 12) + 'px';
  }

  /* ====== admin menu builder ====== */
  function buildMenu(){
    menuPanel.innerHTML = '';
    const h = document.createElement('h3'); h.textContent = 'Admin Control Panel'; menuPanel.appendChild(h);

    // toggles
    const toggleKeys = Object.keys(state.toggles);
    toggleKeys.forEach(key=>{
      const row = document.createElement('div'); row.className = 'section';
      const btn = document.createElement('button'); btn.textContent = `${key} ${state.toggles[key] ? '✅' : '❌'}`;
      btn.onclick = ()=> {
        state.toggles[key] = !state.toggles[key];
        saveState(); buildMenu(); refreshAllWords();
      };
      row.appendChild(btn);
      menuPanel.appendChild(row);
    });

    // behavior numeric controls
    const behavior = document.createElement('div'); behavior.className='section';
    behavior.innerHTML = '<b>Behavior</b>';
    const maxBtn = document.createElement('button'); maxBtn.textContent = `Max clicks: ${state.maxClicks}`; maxBtn.onclick = ()=>{
      const v = parseInt(prompt('Set max clicks', state.maxClicks));
      if(!isNaN(v) && v>0){ state.maxClicks = v; saveState(); updateClicksLeft(); maxBtn.textContent = `Max clicks: ${state.maxClicks}`; }
    };
    const perClickBtn = document.createElement('button'); perClickBtn.textContent = `Darks per click: ${state.darksPerClick}`; perClickBtn.onclick = ()=>{
      const v = parseInt(prompt('Darks per click', state.darksPerClick));
      if(!isNaN(v) && v>0){ state.darksPerClick = v; saveState(); perClickBtn.textContent = `Darks per click: ${state.darksPerClick}`; }
    };
    const redirectBtn = document.createElement('button'); redirectBtn.textContent = 'Set redirect URL'; redirectBtn.onclick = ()=>{
      const u = prompt('Redirect URL', state.redirectURL); if(u){ state.redirectURL = u; saveState(); }
    };
    behavior.appendChild(maxBtn); behavior.appendChild(perClickBtn); behavior.appendChild(redirectBtn);

    // visual controls
    const visuals = document.createElement('div'); visuals.className='section'; visuals.innerHTML = '<b>Visuals</b>';
    const fontBtn = document.createElement('button'); fontBtn.textContent = `Font size: ${state.fontSize}px`; fontBtn.onclick = ()=>{
      const v = parseInt(prompt('Font size (px)', state.fontSize));
      if(!isNaN(v)&&v>8){ state.fontSize = v; saveState(); refreshAllWords(); fontBtn.textContent = `Font size: ${state.fontSize}px`; }
    };
    const spacingBtn = document.createElement('button'); spacingBtn.textContent = `Word spacing: ${state.wordSpacing}px`; spacingBtn.onclick = ()=>{
      const v = parseInt(prompt('Spacing (px)', state.wordSpacing));
      if(!isNaN(v)){ state.wordSpacing = v; saveState(); refreshAllWords(); spacingBtn.textContent = `Word spacing: ${state.wordSpacing}px`; }
    };
    visuals.appendChild(fontBtn); visuals.appendChild(spacingBtn);

    // hold-to-spawn
    const holdRow = document.createElement('div'); holdRow.className='section'; holdRow.innerHTML = '<b>Hold to spawn</b>';
    const holdToggle = document.createElement('button'); holdToggle.textContent = `Hold to spawn: ${state.holdToSpawn ? 'ON' : 'OFF'}`; holdToggle.onclick = ()=>{
      state.holdToSpawn = !state.holdToSpawn; saveState(); buildMenu();
    };
    const holdMs = document.createElement('button'); holdMs.textContent = `Hold time: ${state.holdSpawnTime}ms`; holdMs.onclick = ()=>{
      const v = parseInt(prompt('Hold time in ms', state.holdSpawnTime)); if(!isNaN(v)&&v>=200){ state.holdSpawnTime = v; saveState(); holdMs.textContent = `Hold time: ${state.holdSpawnTime}ms`; }
    };
    holdRow.appendChild(holdToggle); holdRow.appendChild(holdMs);

    // theme selector with names
    const themeRow = document.createElement('div'); themeRow.className='section'; themeRow.innerHTML = '<b>Background themes</b>';
    Object.keys(THEMES).forEach(name => {
      const b = document.createElement('button'); b.textContent = name;
      b.onclick = ()=> { state.themeOverride = name; THEMES[name](); saveState(); };
      themeRow.appendChild(b);
    });
    const randomBtn = document.createElement('button'); randomBtn.textContent = 'Randomize on load'; randomBtn.onclick = ()=>{ state.themeOverride = null; saveState(); pickRandomTheme(); };
    themeRow.appendChild(randomBtn);

    // reset controls
    const resetRow = document.createElement('div'); resetRow.className='section';
    const resetProgress = document.createElement('button'); resetProgress.textContent = 'Reset progress (clear words)'; resetProgress.onclick = ()=> {
      if(confirm('Clear all Dark words and reset count?')){ state.count = 0; container.innerHTML=''; saveState(); updateClicksLeft(); }
    };
    const resetSettings = document.createElement('button'); resetSettings.textContent = 'Reset all settings'; resetSettings.onclick = ()=>{
      if(confirm('Reset settings to defaults?')){ state = JSON.parse(JSON.stringify(defaultState)); saveState(); buildMenu(); refreshAllWords(); updateClicksLeft(); pickRandomTheme(); }
    };
    resetRow.appendChild(resetProgress); resetRow.appendChild(resetSettings);

    // close
    const closeBtn = document.createElement('button'); closeBtn.textContent = 'Close Menu'; closeBtn.onclick = ()=> menuPanel.classList.add('hidden');

    // assemble
    menuPanel.appendChild(behavior);
    menuPanel.appendChild(visuals);
    menuPanel.appendChild(holdRow);
    menuPanel.appendChild(themeRow);
    menuPanel.appendChild(resetRow);
    menuPanel.appendChild(closeBtn);
  }

  /* ====== helper bursts/confetti ====== */
  function spawnBurst(x = window.innerWidth/2, y = window.innerHeight/3, n = 12){
    for(let i=0;i<n;i++){
      const p = document.createElement('div'); p.className='confetti';
      p.textContent = ['✨','🎉','💥','🦭'][Math.floor(Math.random()*4)];
      p.style.left = (x + (Math.random()*200-100)) + 'px';
      p.style.top = (y + (Math.random()*40-20)) + 'px';
      p.style.fontSize = (12 + Math.random()*30) + 'px';
      document.body.appendChild(p);
      setTimeout(()=> p.remove(), 1600 + Math.random()*800);
    }
  }

  /* ====== misc helpers ====== */
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

  /* ====== initial setup ====== */
  function init(){
    // set initial layout settings
    container.style.gap = (state.wordSpacing || 12) + 'px';
    // apply theme (random if not overridden)
    if(state.themeOverride && THEMES[state.themeOverride]) THEMES[state.themeOverride](); else pickRandomTheme();
    // restore count (words won't be persisted visually) but update display
    updateClicksLeft();
    // bind secret corner & keypad built earlier
    buildKeypad();
    // ensure keypad hidden
    keypad.classList.add('hidden');
    // apply persisted toggles to existing words (none initially)
    refreshAllWords();
  }

  /* ====== saveState wrapper ====== */
  function saveState(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){}
  }

  /* ====== start ====== */
  init();

  // expose some helpers for debugging if needed
  window.__ledark = { state, spawnDark, buildMenu, pickRandomTheme, saveState, refreshAllWords };

})();
