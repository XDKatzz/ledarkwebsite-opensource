let count = 0;
let clicksLeft = 1000;
let adminUnlocked = false;
let passwordInput = "";
let toggleStates = {};
let darkContainer = document.getElementById("darkContainer");
let clickBtn = document.getElementById("clickBtn");
let counterBtn = document.getElementById("counterBtn");
let keypad = document.getElementById("keypad");
let menuPanel = document.getElementById("menuPanel");
let settingsBtn = document.getElementById("settingsBtn");
let settingsPanel = document.getElementById("settingsPanel");
let title = document.querySelector("h1");
let trigger = document.getElementById("adminTrigger");

const backgrounds = {
  "Rainbow": "linear-gradient(270deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00ab)",
  "Space": "radial-gradient(circle,#1e3c72,#2a5298)",
  "Matrix": "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "Sunset": "linear-gradient(45deg,#ff6ec4,#7873f5)",
  "Ocean": "linear-gradient(120deg,#00c9ff,#92fe9d)",
  "Fire": "linear-gradient(160deg,#ff4e50,#f9d423)"
};

// random start background
function setRandomBackground() {
  let keys = Object.keys(backgrounds);
  let choice = keys[Math.floor(Math.random()*keys.length)];
  document.body.style.background = backgrounds[choice];
  document.body.style.backgroundSize = "400% 400%";
}
setRandomBackground();

// CLICK HANDLER
clickBtn.addEventListener("click", () => {
  if (clicksLeft > 0) {
    count++;
    clicksLeft--;

    let dark = document.createElement("span");
    dark.classList.add("darkWord");
    dark.textContent = "Dark";
    dark.style.color = `rgb(${clicksLeft/4},${clicksLeft/4},${clicksLeft/4})`;
    darkContainer.appendChild(dark);

    applyToggles(dark);
    counterBtn.textContent = `Clicks left: ${clicksLeft}`;
    if (clicksLeft === 0) window.location.href = "https://therapy.com";
  }
});

// KEYPAD
function createKeypad() {
  keypad.innerHTML = "";
  let keys = ["1","2","3","4","5","6","7","8","9","C","0","E"];
  keys.forEach(k=>{
    let btn = document.createElement("button");
    btn.textContent = k;
    btn.addEventListener("click", ()=>handleKeypadPress(k));
    keypad.appendChild(btn);
  });
}
createKeypad();

function handleKeypadPress(key) {
  if (key === "C") passwordInput = "";
  else if (key === "E") { checkPassword(passwordInput); passwordInput = ""; }
  else if (passwordInput.length < 4) passwordInput += key;
}

// PASSWORDS
function checkPassword(pw) {
  if (pw === "8440") {
    adminUnlocked = true;
    title.textContent = "le dark ✅";
    confettiExplosion();
  } else if (pw === "2871" && adminUnlocked) {
    menuPanel.style.display = (menuPanel.style.display === "block") ? "none" : "block";
    if (menuPanel.style.display === "block") showMenu();
  } else {
    alert("Denied!");
  }
}

// ADMIN MENU
function showMenu() {
  menuPanel.innerHTML = "<h2>Admin Menu</h2>";
  const features = [
    "Rainbow Cycle","Glow Aura","Rotate Spin","Floating Drift","Chaos Shake",
    "Seal Spam","Dark Rain","Explosion Mode","Dark Trails","Invert Mode","Dark Spam"
  ];
  features.forEach(f=>{
    let btn = document.createElement("button");
    btn.textContent = f + (toggleStates[f] ? " ✅":" ❌");
    btn.addEventListener("click", ()=>{
      toggleStates[f] = !toggleStates[f];
      showMenu();
    });
    menuPanel.appendChild(btn);
  });
  // background choices
  Object.keys(backgrounds).forEach(bg=>{
    let btn = document.createElement("button");
    btn.textContent = "BG: "+bg;
    btn.addEventListener("click", ()=>{
      document.body.style.background = backgrounds[bg];
    });
    menuPanel.appendChild(btn);
  });
}

// TOGGLES
function applyToggles(el) {
  if(toggleStates["Rainbow Cycle"]) el.classList.add("rainbow");
  if(toggleStates["Glow Aura"]) el.classList.add("glow");
  if(toggleStates["Rotate Spin"]) el.classList.add("spin");
  if(toggleStates["Floating Drift"]) el.classList.add("float");
  if(toggleStates["Chaos Shake"]) el.classList.add("chaos");
  if(toggleStates["Explosion Mode"]) {
    el.style.position="absolute";
    el.style.left=Math.random()*window.innerWidth+"px";
    el.style.top=Math.random()*window.innerHeight+"px";
  }
  if(toggleStates["Seal Spam"]) {
    let seal=document.createElement("span");
    seal.textContent="🦭";
    seal.style.position="absolute";
    seal.style.left=Math.random()*window.innerWidth+"px";
    seal.style.top=Math.random()*window.innerHeight+"px";
    document.body.appendChild(seal);
    setTimeout(()=>seal.remove(),2000);
  }
  if(toggleStates["Dark Rain"]) {
    let drop=document.createElement("div");
    drop.textContent="Dark";
    drop.classList.add("rainDrop");
    drop.style.left=Math.random()*window.innerWidth+"px";
    document.body.appendChild(drop);
    setTimeout(()=>drop.remove(),4000);
  }
  if(toggleStates["Dark Trails"]) {
    document.onmousemove = e=>{
      let trail=document.createElement("span");
      trail.textContent="dark";
      trail.style.position="fixed";
      trail.style.left=e.clientX+"px";
      trail.style.top=e.clientY+"px";
      trail.style.fontSize="10px";
      document.body.appendChild(trail);
      setTimeout(()=>trail.remove(),500);
    };
  }
  if(toggleStates["Invert Mode"]) {
    document.body.style.filter="invert(1)";
  } else {
    document.body.style.filter="invert(0)";
  }
  if(toggleStates["Dark Spam"]) {
    setInterval(()=>clickBtn.click(),200);
  }
}

// CONFETTI
function confettiExplosion() {
  for(let i=0;i<30;i++){
    let conf=document.createElement("div");
    conf.classList.add("confetti");
    conf.style.left=Math.random()*100+"vw";
    conf.style.backgroundColor=`hsl(${Math.random()*360},100%,50%)`;
    document.body.appendChild(conf);
    setTimeout(()=>conf.remove(),1500);
  }
}

// SETTINGS
settingsBtn.addEventListener("click",()=>{
  settingsPanel.style.display=(settingsPanel.style.display==="block")?"none":"block";
  if(settingsPanel.style.display==="block") showSettings();
});

function showSettings(){
  settingsPanel.innerHTML="<h2>Settings</h2>";
  let soundBtn=document.createElement("button");
  soundBtn.textContent="Sound "+(toggleStates["Sound"]?"ON":"OFF");
  soundBtn.addEventListener("click",()=>{
    toggleStates["Sound"]=!toggleStates["Sound"];
    showSettings();
  });
  settingsPanel.appendChild(soundBtn);

  let counterBtnToggle=document.createElement("button");
  counterBtnToggle.textContent="Show Counter "+(toggleStates["Counter"]?"ON":"OFF");
  counterBtnToggle.addEventListener("click",()=>{
    toggleStates["Counter"]=!toggleStates["Counter"];
    counterBtn.style.display=toggleStates["Counter"]?"inline-block":"none";
    showSettings();
  });
  settingsPanel.appendChild(counterBtnToggle);
}

// ADMIN TRIGGER (hold 1s bottom-right)
let holdTimer;
trigger.addEventListener("mousedown",()=>{ holdTimer=setTimeout(()=>{keypad.style.display="grid";},1000); });
trigger.addEventListener("mouseup",()=>clearTimeout(holdTimer));
