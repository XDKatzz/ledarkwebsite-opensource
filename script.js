let count = 0;
let clicksLeft = 1000;
let adminUnlocked = false;
let menuVisible = false;
let passwordInput = "";
let darkContainer = document.getElementById("darkContainer");
let clickBtn = document.getElementById("clickBtn");
let counterBtn = document.getElementById("counterBtn");
let keypad = document.getElementById("keypad");
let keypadDisplay = document.getElementById("keypadDisplay");
let keypadButtons = document.getElementById("keypadButtons");
let menuPanel = document.getElementById("menuPanel");
let settingsBtn = document.getElementById("settingsBtn");
let settingsPanel = document.getElementById("settingsPanel");
let title = document.getElementById("title");
let trigger = document.getElementById("adminTrigger");
let bottomMessage = document.getElementById("bottomMessage");

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const toggleStates = { Counter:true, Rainbow:false, Glow:false, Spin:false, Float:false, Chaos:false, Pulse:false };

// Random background
const backgrounds = {
  "Rainbow Wave":"linear-gradient(270deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00ab)",
  "Space Grid":"radial-gradient(circle,#1e3c72,#2a5298)",
  "Matrix Rain":"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "VHS Sunset":"linear-gradient(45deg,#ff6ec4,#7873f5)",
  "Neon Ocean":"linear-gradient(120deg,#00c9ff,#92fe9d)",
  "Lava Fire":"linear-gradient(160deg,#ff4e50,#f9d423)"
};
document.body.style.background = backgrounds[Object.keys(backgrounds)[Math.floor(Math.random()*Object.keys(backgrounds).length)]];

// Keypad
function createKeypad(){
  keypadButtons.innerHTML="";
  let keys=["1","2","3","4","5","6","7","8","9","C","0","E"];
  keys.forEach(k=>{
    let btn=document.createElement("button");
    btn.textContent=k;
    btn.addEventListener("click",()=>handleKeypadPress(k));
    keypadButtons.appendChild(btn);
  });
}
createKeypad();

function handleKeypadPress(key){
  if(key==="C") passwordInput="";
  else if(key==="E"){ checkPassword(passwordInput); passwordInput=""; keypadDisplay.textContent=""; keypad.style.display="none";}
  else if(passwordInput.length<4) passwordInput+=key;
  keypadDisplay.textContent=passwordInput;
}

// Check passwords
function checkPassword(pw){
  if(pw==="8440"){ 
    adminUnlocked=!adminUnlocked; 
    title.textContent=adminUnlocked?"le dark ✅":"le dark"; 
    showBottomMessage(adminUnlocked?"Admin Activated":"Admin Deactivated");
    if(!adminUnlocked){ menuPanel.style.display="none"; menuVisible=false; } 
  }
  else if(pw==="2871" && adminUnlocked){
    menuVisible=!menuVisible;
    menuPanel.style.display = menuVisible?"block":"none";
    if(menuVisible) showMenu();
  }
  else showBottomMessage("Denied!");
}

// Add Dark
clickBtn.addEventListener("click",()=>{
  if(clicksLeft>0){
    count++; clicksLeft--;
    let dark=document.createElement("span");
    dark.classList.add("darkWord");
    dark.textContent="Dark";

    let shade = Math.floor((1000-clicksLeft)/1000*255);
    dark.style.color=`rgb(${shade},${shade},${shade})`;

    if(count%50===0) dark.style.fontFamily = "Courier, monospace";

    darkContainer.appendChild(dark);
    applyToggles(dark);

    counterBtn.textContent=`Clicks left: ${clicksLeft}`;
    if(!toggleStates.Counter) counterBtn.style.display="none";

    if(clicksLeft===0) window.location.href="https://therapy.com";
  }
});

function showBottomMessage(msg){
  bottomMessage.textContent=msg;
  bottomMessage.style.display="block";
  setTimeout(()=>bottomMessage.style.display="none",1500);
}

// Settings
settingsBtn.addEventListener("click",()=>settingsPanel.style.display=(settingsPanel.style.display==="block")?"none":"block");
settingsPanel.innerHTML="<h2>Settings</h2><button id='toggleCounter'>Toggle Counter</button>";
document.getElementById("toggleCounter").addEventListener("click",()=>{
  toggleStates.Counter=!toggleStates.Counter;
  showBottomMessage("Counter "+(toggleStates.Counter?"ON":"OFF"));
});

// Admin menu
function showMenu(){
  menuPanel.innerHTML="<h2>Admin Menu</h2>";
  const features=["Rainbow","Glow","Spin","Float","Chaos","Pulse"];
  features.forEach(f=>{
    let btn=document.createElement("button");
    btn.textContent=f+" "+(toggleStates[f]?"✅":"❌");
    btn.addEventListener("click",()=>{
      toggleStates[f]=!toggleStates[f];
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

// Apply toggles
function applyToggles(el){
  el.classList.remove("rainbow","glow","spin","float","chaos","pulse");
  if(toggleStates.Rainbow) el.classList.add("rainbow");
  if(toggleStates.Glow) el.classList.add("glow");
  if(toggleStates.Spin) el.classList.add("spin");
  if(toggleStates.Float) el.classList.add("float");
  if(toggleStates.Chaos) el.classList.add("chaos");
  if(toggleStates.Pulse) el.classList.add("pulse");
}

// Admin trigger
let holdTimer;
trigger.addEventListener(isMobile?"click":"mousedown",()=>{
  if(isMobile){ keypad.style.display="grid"; return; }
  holdTimer=setTimeout(()=>{ keypad.style.display="grid"; },1000);
});
trigger.addEventListener("mouseup",()=>clearTimeout(holdTimer));
