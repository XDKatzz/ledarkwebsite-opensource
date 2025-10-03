let count=0;
let clicksLeft=1000;
let menuVisible=false;
let passwordInput="";
let darkContainer=document.getElementById("darkContainer");
let clickBtn=document.getElementById("clickBtn");
let counterBtn=document.getElementById("counterBtn");
let keypad=document.getElementById("keypad");
let keypadDisplay=document.getElementById("keypadDisplay");
let keypadButtons=document.getElementById("keypadButtons");
let menuPanel=document.getElementById("menuPanel");
let closeAdmin=document.getElementById("closeAdmin");
let settingsBtn=document.getElementById("settingsBtn");
let settingsPanel=document.getElementById("settingsPanel");
let bottomMessage=document.getElementById("bottomMessage");

// Random background
const backgrounds=[
  "linear-gradient(270deg,#ff0000,#ff7300,#fffb00,#48ff00,#00ffd5,#002bff,#7a00ff,#ff00ab)",
  "radial-gradient(circle,#1e3c72,#2a5298)",
  "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
  "linear-gradient(45deg,#ff6ec4,#7873f5)"
];
document.body.style.background=backgrounds[Math.floor(Math.random()*backgrounds.length)];

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

// Add Dark
clickBtn.addEventListener("click",()=>{
  if(clicksLeft>0){
    count++; clicksLeft--;
    let dark=document.createElement("span");
    dark.classList.add("darkWord");
    dark.textContent="Dark";
    let shade=Math.floor((1000-clicksLeft)/1000*255);
    dark.style.color=`rgb(${shade},${shade},${shade})`;
    darkContainer.appendChild(dark);
    counterBtn.textContent=`Clicks left: ${clicksLeft}`;
    if(clicksLeft===0) window.location.href="https://therapy.com";
  }
});

// Admin password
function checkPassword(pw){
  if(pw==="2871"){
    menuVisible=!menuVisible;
    menuPanel.style.display=menuVisible?"block":"none";
  } else {
    bottomMessage.textContent="Denied!";
    bottomMessage.style.display="block";
    setTimeout(()=>bottomMessage.style.display="none",1500);
  }
}

// Close Admin
closeAdmin.addEventListener("click",()=>{
  menuVisible=false;
  menuPanel.style.display="none";
});

// Settings toggle
settingsBtn.addEventListener("click",()=>settingsPanel.style.display=(settingsPanel.style.display==="block")?"none":"block");
settingsPanel.innerHTML="<h2>Settings</h2><button id='toggleCounter'>Toggle Counter</button>";
document.getElementById("toggleCounter").addEventListener("click",()=>{
  counterBtn.style.display=(counterBtn.style.display==="none")?"inline-block":"none";
});
