/* ========== Core elements & state ========== */
const addBtn = document.getElementById('addDarkBtn');
const clicksLeftBtn = document.getElementById('clicksLeftBtn');
const container = document.getElementById('container');
const secretCorner = document.getElementById('secretCorner');
const keypad = document.getElementById('keypad');
const adminMessage = document.getElementById('adminMessage');
const secretTopBtn = document.getElementById('secretTopBtn');
const menuPanel = document.getElementById('menuPanel');
const mainTitle = document.getElementById('mainTitle');
const passwordDisplay = document.getElementById('passwordDisplay');

let count = 0;
let maxClicks = 1000;
let redirectURL = 'https://therapy.com';
let darksPerClick = 1;

const ADMIN_PASS = '8440';
const SECRET_PASS = '2871';
let adminUnlocked = false;

let codeBuffer = '';

/* toggles (all OFF by default) */
const toggles = {
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
  themeOverride: null // null or 'space'|'matrix'|'rainbow'|'calm'
};

/* fonts list for variation */
const fontList = ['"Comic Neue", "Comic Sans MS", cursive','Arial, sans-serif','"Times New Roman", serif','Impact, sans-serif','"Courier New", monospace','Verdana, sans-serif'];

/* ========== Helper UI updates ========== */
function updateClicksLeft(){ clicksLeftBtn.textContent = `Clicks Left: ${Math.max(0, maxClicks - count)}`; }

/* ========== Background themes ========== */
function setThemeRandomOnLoad(){
  const themes = ['calm','space','matrix','rainbow'];
  const pick = themes[Math.floor(Math.random()*themes.length)];
  applyTheme(pick);
}
function applyTheme(name){
  // Remove possible previous inline background styles
  document.body.style.background = '';
  document.body.style.backgroundImage = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundPosition = '';
  // set by name
  switch(name){
    case 'space':
      document.body.style.background = 'radial-gradient(ellipse at bottom, #02010a 0%, #05020a 40%, #0c0820 100%)';
      spawnStars(); // subtle
      break;
    case 'matrix':
      document.body.style.background = 'linear-gradient(180deg,#041712,#041712)';
      break;
    case 'rainbow':
      document.body.style.background = 'linear-gradient(45deg,#ff66ff,#66ffff,#ffcc66)';
      document.body.style.backgroundSize = '400% 400%';
      document.body.style.animation = 'gradientBG 20s ease infinite';
      break;
    default: // calm
      document.body.style.background = 'linear-gradient(135deg,#0b1020 0%, #12121b 50%, #1b1b2b 100%)';
      break;
  }
  toggles.themeOverride = name;
}

/* small star spawn for 'space' theme, non-flashy */
let starCanvas, starCtx, starsRunning=false;
function spawnStars(){
  if(starsRunning) return;
  starCanvas = document.createElement('canvas');
  starCanvas.style.position='fixed';
  starCanvas.style.left='0'; starCanvas.style.top='0';
  starCanvas.style.width='100%'; starCanvas.style.height='100%';
  starCanvas.style.zIndex='-1'; starCanvas.style.pointerEvents='none';
  document.body.appendChild(starCanvas);
  starCtx = starCanvas.getContext('2d');
  function resize(){ starCanvas.width = window.innerWidth; starCanvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  const starCount = Math.min(120, Math.floor(window.innerWidth/8));
  const stars = [];
  for(let i=0;i<starCount;i++){
    stars.push({x:Math.random()*starCanvas.width, y:Math.random()*starCanvas.height, r:Math.random()*1.4+0.6, v:Math.random()*0.02+0.002});
  }
  function draw(){
    starCtx.clearRect(0,0,starCanvas.width,starCanvas.height);
    stars.forEach(s=>{
      starCtx.beginPath();
      starCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
      starCtx.fillStyle = `rgba(255,255,255,${0.6 + Math.sin(performance.now()/1000 + s.x)*0.2})`;
      starCtx.fill();
    });
    requestAnimationFrame(draw);
  }
  starsRunning = true; draw();
}

/* ========== Spawn Dark word(s) ========== */
function spawnDark() {
  // reverseClicks toggle: small chance to decrement instead
  if(toggles.reverseClicks && Math.random() < 0.15) {
    count = Math.max(0, count - 1);
    updateClicksLeft();
    return;
  }

  for(let i=0;i<darksPerClick;i++){
    count++;
    // redirect check
    if(count >= maxClicks){
      window.location.href = redirectURL;
      return;
    }

    // create element
    const el = document.createElement('div');
    el.className = 'darkWord';
    el.textContent = toggles.sealMode ? '🦭' : 'Dark';
    // base style variation
    const font = fontList[count % fontList.length];
    el.style.fontFamily = font;
    // apply toggles (both to this new element & existing ones done in applyAllToggles)
    applyAllToggles(el);
    container.appendChild(el);

    // if rain mode, position absolutely and animate down
    if(toggles.rainMode){
      el.style.position = 'absolute';
      el.style.left = `${Math.random()*(window.innerWidth*0.9)}px`;
      el.style.top = `-40px`;
      const speed = 2 + Math.random()*3;
      const fall = setInterval(()=>{
        const t = parseFloat(el.style.top);
        if(isNaN(t)) { el.style.top = '-40px'; }
        el.style.top = (parseFloat(el.style.top) + speed) + 'px';
        if(parseFloat(el.style.top) > window.innerHeight + 40){ clearInterval(fall); el.remove(); }
      }, 16);
    }
  }

  // page shake effect
  if(toggles.shakeScreen){
    document.body.style.transition = 'transform 0.12s';
    document.body.style.transform = `translate(${(Math.random()*10-5)|0}px, ${(Math.random()*10-5)|0}px)`;
    setTimeout(()=> document.body.style.transform = '', 120);
  }

  updateClicksLeft();
}

/* apply toggles to an element (and used for existing words) */
function applyAllToggles(el){
  // reset style
  el.style.transform = '';
  el.style.animation = '';
  el.style.textShadow = '';
  el.style.filter = '';
  el.classList.remove('pulse','rainbow','spin','floaty','glow','chaos');

  if(toggles.rainbowCycle) el.classList.add('rainbow');
  if(toggles.glowAura) el.classList.add('glow');
  if(toggles.spin) el.classList.add('spin');
  if(toggles.floaty) el.classList.add('floaty');
  if(toggles.chaos){
    // set custom properties for random skew/scale/rotate to avoid layout jumps
    el.style.setProperty('--r', (Math.random()*40-20)+'deg');
    el.style.setProperty('--skx', (Math.random()*10-5)+'deg');
    el.style.setProperty('--sky', (Math.random()*6-3)+'deg');
    el.style.setProperty('--s', (1 + Math.random()*0.6));
    el.classList.add('chaos');
  }
  if(toggles.confetti && Math.random() < 0.3){
    el.textContent += ' 🎉';
  }
  if(toggles.flipText && Math.random() < 0.15){
    el.style.transform += ' rotateX(180deg)';
  }
  if(toggles.glowAura) el.classList.add('glow');
}

/* update all existing words when toggles change */
function refreshAllWords(){
  const words = document.querySelectorAll('.darkWord');
  words.forEach(w => applyAllToggles(w));
}

/* ========== Admin keypad (long-press corner to reveal) ========== */
let holdTimer = null;
const HOLD_MS = 800;

function showKeypad(){
  keypad.classList.remove('hidden');
  keypad.classList.add('show');
  keypad.setAttribute('aria-hidden','false');
}

function hideKeypad(){
  keypad.classList.add('hidden');
  keypad.classList.remove('show');
  keypad.setAttribute('aria-hidden','true');
}

secretCorner.addEventListener('mousedown', ()=>{ holdTimer = setTimeout(showKeypad, HOLD_MS); });
secretCorner.addEventListener('mouseup', ()=>{ clearTimeout(holdTimer); });
secretCorner.addEventListener('mouseleave', ()=>{ clearTimeout(holdTimer); });
secretCorner.addEventListener('touchstart', ()=>{ holdTimer = setTimeout(showKeypad, HOLD_MS); }, {passive:true});
secretCorner.addEventListener('touchend', ()=>{ clearTimeout(holdTimer); });

/* build keypad buttons */
(function buildKeypad(){
  const keys = ['1','2','3','4','5','6','7','8','9','0','C','E'];
  // clear existing
  keypad.innerHTML = '';
  const display = document.createElement('div');
  display.id = 'passwordDisplay'; display.textContent = '----';
  keypad.appendChild(display);
  for(let r=0;r<4;r++){
    const row = document.createElement('div'); row.className='row';
    for(let c=0;c<3;c++){
      const k = keys[r*3+c];
      const btn = document.createElement('button');
      btn.className = 'key' + (k==='C' || k==='E' ? ' wide' : '');
      btn.textContent = k;
      btn.addEventListener('click', ()=> onKeyPress(k));
      row.appendChild(btn);
    }
    keypad.appendChild(row);
  }
})();

function onKeyPress(k){
  if(k === 'C'){ codeBuffer = ''; adminMessage.textContent = ''; updateDisplay(); return; }
  if(k === 'E'){ checkEnteredCode(); return; }
  if(codeBuffer.length < 4) codeBuffer += k;
  updateDisplay();
}
function updateDisplay(){ const d = document.getElementById('passwordDisplay'); if(d) d.textContent = codeBuffer.padEnd(4,'-'); }

/* handle codes */
function checkEnteredCode(){
  // clear any previous secret message highlight
  adminMessage.classList.remove('pulse-hint');

  if(codeBuffer === ADMIN_PASS){
    adminUnlocked = !adminUnlocked;
    if(adminUnlocked){
      adminMessage.textContent = '✅ Admin Mode Activated';
      adminMessage.classList.remove('hidden');
      mainTitle.textContent = 'le dark ✅';
      secretTopBtn.classList.remove('hidden');
      secretTopBtn.setAttribute('aria-hidden','false');
      // small confetti spawn
      spawnConfetti(15);
    } else {
      adminMessage.textContent = '❎ Admin Mode Deactivated';
      mainTitle.textContent = 'le dark';
      secretTopBtn.classList.add('hidden');
      secretTopBtn.setAttribute('aria-hidden','true');
      menuPanel.classList.add('hidden');
    }
    hideKeypad();
  }
  else if(adminUnlocked && codeBuffer === SECRET_PASS){
    // reveal the secret top button (makes menu accessible)
    secretTopBtn.classList.remove('hidden');
    secretTopBtn.setAttribute('aria-hidden','false');
    adminMessage.textContent = '✨ Secret Ready (tap top-left)';
    // small visual hint
    adminMessage.classList.remove('hidden');
    adminMessage.classList.add('pulse-hint');
    setTimeout(()=>adminMessage.classList.remove('pulse-hint'), 1200);
  }
  else if(adminUnlocked && codeBuffer.length > 0 && Math.random() < 0.4){
    adminMessage.textContent = '✨ Secret Feature Unlocked!';
    adminMessage.classList.remove('hidden');
  } else {
    adminMessage.textContent = '❌ Access Denied';
    adminMessage.classList.remove('hidden');
  }
  codeBuffer = ''; updateDisplay();
}

/* ========== Admin menu (top-left button toggles) ========== */
secretTopBtn.addEventListener('click', ()=>{
  if(!adminUnlocked) return;
  // toggle menu visibility
  if(menuPanel.classList.contains('hidden')){
    menuPanel.classList.remove('hidden');
    menuPanel.innerHTML = '';
    buildMenu();
  } else {
    menuPanel.classList.add('hidden');
  }
});

function buildMenu(){
  const header = document.createElement('b');
  header.textContent = 'Admin Menu';
  menuPanel.appendChild(header);

  // toggles list (all off by default)
  const toggleList = [
    {key:'rainbowCycle', label:'Rainbow Cycle'},
    {key:'glowAura', label:'Glow Aura'},
    {key:'spin', label:'Spin (rotate)'},
    {key:'floaty', label:'Float (drift)'},
    {key:'chaos', label:'Chaos (skew/rotate)'},
    {key:'rainMode', label:'Rain Mode (falling darks)'},
    {key:'confetti', label:'Confetti pop'},
    {key:'sealMode', label:'Seal Spam (🦭)'},
    {key:'shakeScreen', label:'Shake Screen'},
    {key:'flipText', label:'Flip Text Occasionally'},
    {key:'reverseClicks', label:'Reverse Clicks occasionally'}
  ];

  toggleList.forEach(t=>{
    const btn = document.createElement('button');
    btn.textContent = `${t.label} ${toggles[t.key] ? '✅' : '❌'}`;
    btn.style.display='block';
    btn.style.margin='6px 0';
    btn.style.width='100%';
    btn.onclick = ()=> {
      toggles[t.key] = !toggles[t.key];
      btn.textContent = `${t.label} ${toggles[t.key] ? '✅' : '❌'}`;
      // update existing elements immediately
      refreshAllWords();
    };
    menuPanel.appendChild(btn);
  });

  // theme controls (random on load but allow override)
  const themeTitle = document.createElement('div'); themeTitle.innerHTML = '<br><b>Background</b>'; menuPanel.appendChild(themeTitle);
  ['calm','space','matrix','rainbow'].forEach(theme=>{
    const tbtn = document.createElement('button');
    tbtn.textContent = `Theme: ${theme}`; tbtn.style.display='inline-block'; tbtn.style.margin='6px 4px';
    tbtn.onclick = ()=> { toggles.themeOverride = theme; applyTheme(theme); };
    menuPanel.appendChild(tbtn);
  });
  const randomThemeBtn = document.createElement('button');
  randomThemeBtn.textContent = 'Randomize Theme';
  randomThemeBtn.style.display='block'; randomThemeBtn.style.marginTop='8px';
  randomThemeBtn.onclick = ()=> { toggles.themeOverride = null; setThemeRandomOnLoad(); menuPanel.classList.add('hidden'); };
  menuPanel.appendChild(randomThemeBtn);

  // behavior controls
  const behaviorTitle = document.createElement('div'); behaviorTitle.innerHTML = '<br><b>Behavior</b>'; menuPanel.appendChild(behaviorTitle);
  const maxBtn = document.createElement('button'); maxBtn.textContent = `Max clicks: ${maxClicks}`; maxBtn.onclick = ()=>{
    const val = parseInt(prompt('New max clicks', maxClicks));
    if(!isNaN(val) && val>0) maxClicks = val; maxBtn.textContent = `Max clicks: ${maxClicks}`;
  }; menuPanel.appendChild(maxBtn);

  const redirectBtn = document.createElement('button'); redirectBtn.textContent='Set redirect URL';
  redirectBtn.onclick = ()=>{ const u = prompt('Redirect URL', redirectURL); if(u) redirectURL = u; }; menuPanel.appendChild(redirectBtn);

  const perClickBtn = document.createElement('button'); perClickBtn.textContent = `Darks per click: ${darksPerClick}`;
  perClickBtn.onclick = ()=>{ const v = parseInt(prompt('Darks per click', darksPerClick)); if(!isNaN(v) && v>0) darksPerClick = v; perClickBtn.textContent = `Darks per click: ${darksPerClick}`; };
  menuPanel.appendChild(perClickBtn);

  // Save/Close
  const closeBtn = document.createElement('button'); closeBtn.textContent = 'Close Menu'; closeBtn.style.marginTop='10px';
  closeBtn.onclick = ()=> menuPanel.classList.add('hidden');
  menuPanel.appendChild(closeBtn);

  // apply current toggles to existing words
  refreshAllWords();
}

/* ========== helper functions ========== */
function refreshAllWords(){
  const all = document.querySelectorAll('.darkWord');
  all.forEach(el => applyAllToggles(el));
}

/* small confetti spawn (visual only) */
function spawnConfetti(n=12){
  for(let i=0;i<n;i++){
    const c = document.createElement('div');
    c.textContent = ['🎉','✨','💥','🦭'][Math.floor(Math.random()*4)];
    c.style.position = 'fixed';
    c.style.left = (20 + Math.random()*(window.innerWidth-40)) + 'px';
    c.style.top = (20 + Math.random()*200) + 'px';
    c.style.fontSize = `${12 + Math.random()*28}px`;
    c.style.zIndex = 9999;
    c.style.pointerEvents = 'none';
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 1600 + Math.random()*800);
  }
}

/* ========== keyboard accessibility: allow pressing 'k' to open keypad (dev) ========== */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'k') showKeypad();
});

/* ========== initial setup ========== */
/* random theme on load unless overridden by admin later */
setThemeRandomOnLoad();
updateClicksLeft();

/* expose spawnDark to Add Dark button */
addBtn.addEventListener('click', spawnDark);

/* Make sure touch devices are happy: prevent background flash by not animating heavy BG on mobile */
(function mobileBgTweak(){
  if(/Mobi|Android/i.test(navigator.userAgent)){
    // reduce fancy animations on very small screens to avoid flashing
    document.documentElement.style.setProperty('--bg-ease','60s');
  }
})();
