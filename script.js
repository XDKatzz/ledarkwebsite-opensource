let count=0, maxClicks=1000, redirectURL="https://therapy.com", darksPerClick=1;
const fonts=['"Comic Sans MS",cursive,sans-serif','Arial','"Times New Roman"','Impact','"Courier New"','Verdana'];
const encodedPassword="ODQ0MA==", correctPassword=atob(encodedPassword);
let enteredPassword="", adminUnlocked=false;
const realSecretPassword="2871";
const dummyPasswords=Array.from({length:100},()=>Math.floor(Math.random()*9000+1000).toString());

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

    if(toggleStates.darkPulse) newWord.style.animation="pulse 1.2s infinite alternate";
    if(toggleStates.colorCycle) newWord.style.animation+=" colorShift 3s infinite linear";
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
  else{ addDarkBtn.style.display="inline-block"; document.getElementById("clicksLeftBtn").style.display="inline-block"; }

  if(count===1 && !adminUnlocked) secretBtn.style.display="block";
  if(adminUnlocked) document.getElementById("keypad").style.display="block";
}

// ===== Admin Functions =====
let holdTimer; const holdTime=1000;
function startHold(){ holdTimer=setTimeout(toggleKeypad, holdTime);}
function cancelHold(){ clearTimeout(holdTimer);}
secretBtn.addEventListener('mousedown', startHold);
secretBtn.addEventListener('mouseup', cancelHold);
secretBtn.addEventListener('mouseleave', cancelHold);
secretBtn.addEventListener('touchstart', startHold);
secretBtn.addEventListener('touchend', cancelHold);

function toggleKeypad(){ const keypad=document.getElementById("keypad"); keypad.style.display=(keypad.style.display==="block")?"none":"block"; enteredPassword=""; updatePasswordDisplay(); }
function pressKey(num){ if(enteredPassword.length<4){ enteredPassword+=num; updatePasswordDisplay(); } }
function clearPassword(){ enteredPassword=""; updatePasswordDisplay(); }
function updatePasswordDisplay(){ document.getElementById("passwordDisplay").textContent=enteredPassword.padEnd(4,"-"); }

function checkPassword(){
  adminMsg.style.display="block"; secretTopBtn.style.display="none";
  if(!adminUnlocked && enteredPassword===correctPassword){
    adminUnlocked=true; adminMsg.textContent="✅ Admin Mode Activated!"; adminMsg.style.color="green";
    secretBtn.classList.add("visible"); document.querySelector("h1").textContent="le dark ✅"; document.getElementById("keypad").style.display="block";
  } else if(adminUnlocked){
    if(enteredPassword===realSecretPassword){
      secretTopBtn.style.display="block"; menuPanel.style.display="none";
    } else if(enteredPassword===correctPassword){
      adminUnlocked=false; menuPanel.style.display="none"; secretTopBtn.style.display="none";
      secretBtn.classList.remove("visible"); document.getElementById("keypad").style.display="none"; document.querySelector("h1").textContent="le dark";
      adminMsg.textContent="❎ Admin Mode Deactivated. Settings Saved."; adminMsg.style.color="orange";
    } else if(dummyPasswords.includes(enteredPassword)){
      adminMsg.textContent="✨ Secret Feature Unlocked!"; adminMsg.style.color="purple";
    } else{ adminMsg.textContent="❌ Access Denied"; adminMsg.style.color="red"; }
  } else{ adminMsg.textContent="❌ Access Denied"; adminMsg.style.color="red"; }
  clearPassword();
}

// Secret top button toggle
secretTopBtn.addEventListener("click", ()=>{
    if(adminUnlocked){
        menuPanel.style.display = (menuPanel.style.display === "block") ? "none" : "block";
        showMenu();
    }
});

// ===== Admin Menu =====
function showMenu(){
  menuPanel.style.display="block"; menuPanel.innerHTML="<b>Admin Menu</b><br>";
  Object.keys(toggleStates).forEach(option=>{
    const btn=document.createElement("button");
    btn.textContent=option+(toggleStates[option]?" ✅":" ❌");
    btn.onclick=()=>{ toggleStates[option]=!toggleStates[option]; btn.textContent=option+(toggleStates[option]?" ✅":" ❌"); applyToggle(option,toggleStates[option]); };
    menuPanel.appendChild(btn);
  });

  // Extra controls
  const maxClicksBtn=document.createElement("button");
  maxClicksBtn.textContent="Set Max Clicks ("+maxClicks+")";
  maxClicksBtn.onclick=()=>{ let val=parseInt(prompt("New Max Clicks:",maxClicks)); if(!isNaN(val) && val>0) maxClicks=val; maxClicksBtn.textContent="Set Max Clicks ("+maxClicks+")"; };
  menuPanel.appendChild(maxClicksBtn);

  const redirectBtn=document.createElement("button");
  redirectBtn.textContent="Set Redirect URL";
  redirectBtn.onclick=()=>{ let val=prompt("New URL:",redirectURL); if(val) redirectURL=val; };
  menuPanel.appendChild(redirectBtn);

  const darkPerClickBtn=document.createElement("button");
  darkPerClickBtn.textContent="Darks per Click ("+darksPerClick+")";
  darkPerClickBtn.onclick=()=>{ let val=parseInt(prompt("Darks per click:",darksPerClick)); if(!isNaN(val) && val>0) darksPerClick=val; darkPerClickBtn.textContent="Darks per Click ("+darksPerClick+")"; };
  menuPanel.appendChild(darkPerClickBtn);
}

function applyToggle(option,state){
  const words=document.querySelectorAll(".darkWord");
  words.forEach(w=>{
    switch(option){
      case "darkPulse": state?w.style.animation="pulse 1.2s infinite alternate":w.style.animation="none"; break;
      case "colorCycle": state?w.style.animation+=" colorShift 3s infinite linear": w.style.animation="none"; break;
      case "sizeChange": w.style.transform=state?"scale(1.5)":"scale(1)"; break;
      case "rotate": w.style.animation=state?"rotateAnim 10s infinite linear":"none"; break;
      case "shadowGlow": w.style.textShadow=state?"0 0 12px #ff66ff":"none"; break;
    }
  });
}

// ===== Particle Background =====
const canvas=document.getElementById("particleCanvas"); const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
let particles=[];
for(let i=0;i<120;i++) particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*2+1,speed:Math.random()*0.5+0.2});
function drawParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{ ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,2*Math.PI); ctx.fillStyle="rgba(255,255,255,0.7)"; ctx.fill(); p.y-=p.speed; if(p.y<0)p.y=canvas.height; }); requestAnimationFrame(drawParticles);}
drawParticles();
window.addEventListener("resize",()=>{canvas.width=window.innerWidth; canvas.height=window.innerHeight;});
