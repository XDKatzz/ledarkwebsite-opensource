let count = 0;
let clicksLeft = 1000;
let adminUnlocked = false;
let passwordInput = "";
let toggleStates = { "Counter": true, "Sound": false };
let darkContainer = document.getElementById("darkContainer");
let clickBtn = document.getElementById("clickBtn");
let counterBtn = document.getElementById("counterBtn");
let keypad = document.getElementById("keypad");
let keypadDisplay = document.getElementById("keypadDisplay");
let menuPanel = document.getElementById("menuPanel");
let settingsBtn = document.getElementById("settingsBtn");
let settingsPanel = document.getElementById("settingsPanel");
let title = document.querySelector("h1");
let trigger = document.getElementById("adminTrigger");
let bottomMessage = document.getElementById("bottomMessage");

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const backgrounds = {
  "Rainbow Wave": "linear-gradient(270deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00ab)",
  "Space Grid": "radial-gradient(circle,#1e3c72,#2a5298)",
  "Matrix Rain": "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "VHS Sunset": "linear-gradient(45deg,#ff6ec4,#7873f5)",
  "Neon Ocean": "linear-gradient(120deg,#00c9ff,#92fe9d)",
  "Lava Fire": "linear-gradient(160deg,#ff4e50,#f9d423)"
};

function setRandomBackground() {
  let keys = Object.keys(backgrounds);
  let choice = keys[Math.floor(Math.random() * keys.length)];
  document.body.style.background = backgrounds[choice];
}
setRandomBackground();

// CLICK
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
    if (!toggleStates["Counter"]) counterBtn.style.display="none";
    if (clicksLeft === 0) window.location.href="https://therapy.com";
  }
});

// KEYPAD
function createKeypad() {
  keypad.innerHTML = "<div id='keypadDisplay'></div>";
  let keys = ["1","2","3","4","5","6","7","8","9","C","0","E"];
  keys.forEach(k => {
    let btn = document.createElement("button");
    btn.textContent = k;
    btn.addEventListener("click", ()=>handleKeypadPress(k));
    keypad.appendChild(btn);
  });
}
createKeypad();

function handleKeypadPress(key){
  if(key==="C") passwordInput="";
  else if(key==="E"){ checkPassword(passwordInput); passwordInput=""; keypadDisplay.textContent=""; keypad.style.display="none";}
  else if(passwordInput.length<4) passwordInput+=key;
  keypadDisplay.textContent=passwordInput;
}

// ADMIN CHECK
function checkPassword(pw){
  if(pw==="8440"){
    adminUnlocked = !adminUnlocked;
    title.textContent = adminUnlocked ? "le dark ✅" : "le dark";
    showBottomMessage(adminUnlocked ? "Admin Activated":"Admin Deactivated");
    if(!adminUnlocked) menuPanel.style.display="none";
  } else if(pw==="2871" && adminUnlocked){
    menuPanel.style.display = (menuPanel.style.display==="block")?"none":"block";
    if(menuPanel.style.display==="block") showMenu();
  } else alert("Denied!");
}

// BOTTOM MESSAGE
function showBottomMessage(msg){
  bottomMessage.textContent=msg;
  bottomMessage.style.display="block";
  setTimeout(()=>{bottomMessage.style.display="none";},1500);
}

// ADMIN MENU
function showMenu(){
  menuPanel.innerHTML="<h2>Admin Menu</h2>";
  const features=["Rainbow Cycle","Glow Aura","Rotate Spin","Floating Drift","Chaos Shake",
                  "Seal Spam","Dark Rain","Invert Colors","Pulse Glow","Shake Everything","Dark Flood"];
  features.forEach(f=>{
    let btn=document.createElement("button");
    btn.textContent=f+(toggleStates[f]?" ✅":" ❌");
    btn.addEventListener("click",()=>{
      toggleStates[f]=!toggleStates[f];
      if(f==="Invert Colors") document.body.style.filter=toggleStates[f]?"invert(1)":"none";
      if(f==="Shake Everything") document.body.classList.toggle("chaos",toggleStates[f]);
      if(f==="Pulse Glow") title.classList.toggle("pulse",toggleStates[f]);
      showMenu();
    });
    menuPanel.appendChild(btn);
  });
  Object.keys(backgrounds).forEach(bg=>{
    let btn=document.createElement("button");
    btn.textContent="BG: "+bg;
    btn.addEventListener("click",()=>document.body.style.background=backgrounds[bg]);
    menuPanel.appendChild(btn);
  });
}

// TOGGLES
function applyToggles(el){
  if(toggleStates["Rainbow Cycle"]) el.classList.add("rainbow");
  if(toggleStates["Glow Aura"]) el.classList.add("glow");
  if(toggleStates["Rotate Spin"]) el.classList.add("spin");
  if(toggleStates["Floating Drift"]) el.classList.add("float");
  if(toggleStates["Chaos Shake"]) el.classList.add("chaos");
  if(toggleStates["Pulse Glow"]) el.classList.add("pulse");

  if(toggleStates["Seal Spam"]){
    let seal=document.createElement("span");
    seal.textContent="🦭";
    seal.style.position="absolute";
    seal.style.left=Math.random()*window.innerWidth+"px";
    seal.style.top=Math.random()*window.innerHeight+"px";
    document.body.appendChild(seal);
    setTimeout(()=>seal.remove(),2000);
  }
  if(toggleStates["Dark Rain"]){
    let drop=document.createElement("div");
    drop.textContent="Dark";
    drop.classList.add("rainDrop");
    drop.style.left=Math.random()*window.innerWidth+"px";
    document.body.appendChild(drop);
    setTimeout(()=>drop.remove(),4000);
  }
  if(toggleStates["Dark Flood"]){
    let flood=document.createElement("span");
    flood.textContent="Dark";
    flood.classList.add("darkWord");
    document.body.appendChild(flood);
    setTimeout(()=>flood.remove(),5000);
  }
}

// ADMIN TRIGGER (hold 1s desktop, click mobile)
let holdTimer;
trigger.addEventListener(isMobile?"click":"mousedown",()=>{
  if(isMobile){ keypad.style.display="grid"; return; }
  holdTimer=setTimeout(()=>{keypad.style.display="grid";},1000);
});
trigger.addEventListener("mouseup",()=>clearTimeout(holdTimer));
