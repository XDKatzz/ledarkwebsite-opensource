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
let closeMenu = document.getElementById("closeMenu");
let settingsBtn = document.getElementById("settingsBtn");
let settingsPanel = document.getElementById("settingsPanel");
let title = document.getElementById("title");
let trigger = document.getElementById("adminTrigger");
let bottomMessage = document.getElementById("bottomMessage");

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const toggleStates = { Counter:true, Sound:false, Music:false };

// Fonts to rotate
const fonts = ["Comic Sans MS, cursive", "Courier, monospace", "Impact, sans-serif", "Arial Black, sans-serif"];

// Random background each refresh
const backgrounds = {
  "Rainbow Wave":"linear-gradient(270deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00ab)",
  "Space Grid":"radial-gradient(circle,#1e3c72,#2a5298)",
  "Matrix Rain":"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "VHS Sunset":"linear-gradient(45deg,#ff6ec4,#7873f5)",
  "Neon Ocean":"linear-gradient(120deg,#00c9ff,#92fe9d)",
  "Lava Fire":"linear-gradient(160deg,#ff4e50,#f9d423)"
};
document.body.style.background = backgrounds[Object.keys(backgrounds)[Math.floor(Math.random()*Object.keys(backgrounds).length)]];

// Create keypad
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

// Add Dark
clickBtn.addEventListener("click",()=>{
  if(clicksLeft>0){
    count++; clicksLeft--;

    let dark=document.createElement("span");
    dark.classList.add("darkWord");
    dark.textContent="Dark";

    // progressively darker text
    let shade = Math.max(0, Math.floor(255 - (count/1000 * 255)));
    dark.style.color=`rgb(${shade},${shade},${shade})`;

    // change font every 50 clicks
    if(count % 50 === 0){
      let fontIndex = (count/50) % fonts.length;
      dark.style.fontFamily = fonts[fontIndex];
    }

    darkContainer.appendChild(dark);
    counterBtn.textContent=`Clicks left: ${clicksLeft}`;
    counterBtn.style.display = toggleStates.Counter ? "inline-block" : "none";

    if(clicksLeft===0) window.location.href="https://therapy.com";
  }
});

// Admin trigger
trigger.addEventListener(isMobile?"click":"mousedown",()=>{
  if(isMobile){ keypad.style.display="grid"; return; }
  let holdTimer=setTimeout(()=>{ keypad.style.display="grid"; },1000);
  trigger.addEventListener("mouseup",()=>clearTimeout(holdTimer));
});

// Settings toggle
settingsBtn.addEventListener("click",()=>{
  settingsPanel.style.display=(settingsPanel.style.display==="block")?"none":"block";
});

// Settings buttons
document.getElementById("toggleCounter").addEventListener("click",()=>{
  toggleStates.Counter=!toggleStates.Counter;
  counterBtn.style.display = toggleStates.Counter ? "inline-block" : "none";
  showMessage("Counter "+(toggleStates.Counter?"ON":"OFF"));
});
document.getElementById("toggleSound").addEventListener("click",()=>{
  toggleStates.Sound=!toggleStates.Sound;
  showMessage("Sound Effects "+(toggleStates.Sound?"ON":"OFF"));
});
document.getElementById("toggleMusic").addEventListener("click",()=>{
  toggleStates.Music=!toggleStates.Music;
  showMessage("Music "+(toggleStates.Music?"ON":"OFF"));
});

// Password checks
function checkPassword(pw){
  if(pw==="8440"){ 
    adminUnlocked=!adminUnlocked; 
    title.textContent=adminUnlocked?"le dark ✅":"le dark"; 
    showMessage(adminUnlocked?"Admin Activated":"Admin Deactivated");
    if(!adminUnlocked){ menuPanel.style.display="none"; menuVisible=false; } 
  }
  else if(pw==="2871" && adminUnlocked){
    menuVisible=!menuVisible;
    menuPanel.style.display = menuVisible?"block":"none";
  }
  else{
    showMessage("Denied!");
  }
}

// Close admin panel with ❌
closeMenu.addEventListener("click",()=>{
  menuVisible=false;
  menuPanel.style.display="none";
});

// Message helper
function showMessage(msg){
  bottomMessage.textContent=msg;
  bottomMessage.style.display="block";
  setTimeout(()=>bottomMessage.style.display="none",1500);
}
