// ==== Core Variables ====
let count = 0, maxClicks = 1000, redirectURL="https://therapy.com", darksPerClick=1;
const fonts = ['"Comic Sans MS",cursive,sans-serif','Arial','"Times New Roman"','Impact','"Courier New"','Verdana'];
const encodedPassword = "ODQ0MA=="; // 8440
const correctPassword = atob(encodedPassword);
let enteredPassword="", adminUnlocked=false;
const realSecretPassword="2871";
const dummyPasswords=Array.from({length:100},()=>Math.floor(Math.random()*9000+1000).toString());

// ==== Toggles ====
const toggleStates = { darkPulse:false, colorCycle:false, sizeChange:false, rotate:true, shadowGlow:true, chaosMode:false, rainbowMode:false,
  confettiMode:false, flipText:false, shakeScreen:false, emojiRain:false, reverseClicks:false, spinTitle:false, hideButtons:false };

const addDarkBtn=document.getElementById("addDarkBtn");
const secretBtn=document.getElementById("secretBtn");
const adminMsg=document.getElementById("adminMessage");
const menuPanel=document.getElementById("menuPanel");
const secretTopBtn=document.getElementById("secretTopBtn");
const container=document.getElementById("container");
const mainTitle=document.getElementById("mainTitle");

addDarkBtn.addEventListener('click', spawnDark);

// ==== Spawn Dark ====
function spawnDark(){
  for(let i=0;i<darksPerClick;i++){
    if(toggleStates.reverseClicks && Math.random()<0.2){ count=Math.max(0,count-1); continue; }
    count++; 
    if(count>=maxClicks){ window.location.href=redirectURL; return; }

    let progress=count/maxClicks;
    let shade=Math.round(255 - progress*200);
    let color=`rgb(${shade},${shade},${shade})`;
    let fontIndex=Math.floor(count/50)%fonts.length;
    let font=fonts[fontIndex];

    let newWord=document.createElement("div");
    newWord.textContent="Dark";
    newWord.classList.add("darkWord");
    newWord.style.color=color;
    newWord.style.fontFamily=font;

    // crazy visual effects
    if(toggleStates.darkPulse) newWord.style.animation="pulse 1.2s infinite alternate";
    if(toggleStates.colorCycle) newWord.style.animation="colorShift 3s infinite linear";
    if(toggleStates.sizeChange) newWord.style.transform="scale(1.5)";
    if(toggleStates.rotate) newWord.style.animation+=" rotateAnim 10s infinite linear";
    if(toggleStates.shadowGlow) newWord.style.textShadow="0 0 12px #ff66ff";
    if(toggleStates.chaosMode) newWord.style.transform+=` rotate(${Math.random()*60-30}deg) scale(${1+Math.random()*0.8})`;
    if(toggleStates.rainbowMode) newWord.style.color=`hsl(${Math.random()*360},100%,70%)`;
    if(toggleStates.flipText && Math.random()<0.2) newWord.style.transform+=" rotateX(180deg)";
    if(toggleStates.confettiMode && Math.random()<0.3) newWord.textContent+=" 🎉";
    if(toggleStates.emojiRain && Math.random()<0.2) newWord.textContent+=" 😂";

    container.appendChild(newWord);
  }
  document.getElementById("clicksLeftBtn").textContent="Clicks Left: "+(maxClicks-count);
  if(toggleStates.spinTitle) mainTitle.style.transform=`rotate(${count}deg)`;
  if(toggleStates.shakeScreen) document.body.style.transform=`translate(${Math.random()*4-2}px,${Math.random()*4-2}px)`;
  if(toggleStates.hideButtons){ addDarkBtn.style.display="none"; document.getElementById("clicksLeftBtn").style.display="none"; } 
  else { addDarkBtn.style.display="inline-block"; document.getElementById("clicksLeftBtn").style.display="inline-block"; }

  if(count===1 && !adminUnlocked) secretBtn.style.display="block";
  if(adminUnlocked) document.getElementById("keypad").style.display="block";
}
