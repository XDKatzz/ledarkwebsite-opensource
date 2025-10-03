const darkBtn = document.getElementById("darkBtn");
const clicksLeftBtn = document.getElementById("clicksLeftBtn");
const container = document.getElementById("container");
const secretBtn = document.getElementById("secretBtn");
const keypad = document.getElementById("keypad");
const adminMessage = document.getElementById("adminMessage");
const secretTopBtn = document.getElementById("secretTopBtn");
const menuPanel = document.getElementById("menuPanel");
const title = document.getElementById("title");

let count = 0;
let maxClicks = 1000;
let redirectLink = "https://therapy.com";
let darksPerClick = 1;

let adminUnlocked = false;
let inputCode = "";

const adminPassword = "8440";
const secretFeatureCode = "2871";

let toggleStates = {
  darkPulse: false,
  colorCycle: false,
  sizeChange: false,
  rotate: false,
  shadowGlow: false,
  chaosMode: false,
  shakyMode: false,
  mirrorMode: false,
  rainMode: false,
  sealSpam: false
};

function updateClicksLeft() {
  clicksLeftBtn.textContent = (maxClicks - count) + " clicks left";
}

// --- Add Dark button ---
darkBtn.addEventListener("click", () => {
  if (adminUnlocked) keypad.classList.add("hidden");

  for (let i = 0; i < darksPerClick; i++) {
    const span = document.createElement("span");
    span.textContent = toggleStates.sealSpam ? "🦭" : "Dark";
    span.className = "darkWord";
    container.appendChild(span);
    applyAllToggles(span);
  }

  count += 1;
  updateClicksLeft();

  if (count >= maxClicks) {
    window.location.href = redirectLink;
  }
});

// --- Hidden admin button ---
let holdTimer;
secretBtn.addEventListener("mousedown", () => {
  holdTimer = setTimeout(() => keypad.classList.add("show"), 800);
});
secretBtn.addEventListener("mouseup", () => clearTimeout(holdTimer));
secretBtn.addEventListener("touchstart", () => {
  holdTimer = setTimeout(() => keypad.classList.add("show"), 800);
});
secretBtn.addEventListener("touchend", () => clearTimeout(holdTimer));

// --- Build keypad ---
function buildKeypad() {
  keypad.innerHTML = "";
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "C", "E"].forEach(k => {
    const btn = document.createElement("button");
    btn.textContent = k;
    btn.className = "key";
    btn.onclick = () => handleKey(k);
    keypad.appendChild(btn);
  });
}
buildKeypad();

function handleKey(k) {
  if (k === "C") {
    inputCode = "";
    adminMessage.textContent = "";
  } else if (k === "E") {
    checkCode();
  } else {
    if (inputCode.length < 4) inputCode += k;
  }
}

function checkCode() {
  if (inputCode === adminPassword) {
    adminUnlocked = !adminUnlocked;
    adminMessage.textContent = adminUnlocked ? "Activated" : "Denied";
    if (adminUnlocked) {
      title.textContent = "le dark ✅";
      secretTopBtn.classList.remove("hidden");
    } else {
      title.textContent = "le dark";
      secretTopBtn.classList.add("hidden");
      menuPanel.style.display = "none";
    }
  } else if (adminUnlocked && inputCode === secretFeatureCode) {
    secretTopBtn.classList.remove("hidden");
    secretTopBtn.onclick = () => {
      showMenu();
    };
  } else {
    adminMessage.textContent = "Denied";
  }
  inputCode = "";
}

// --- Admin menu ---
function showMenu() {
  menuPanel.style.display = "block";
  menuPanel.innerHTML = "<b>Admin Menu</b><br>";

  Object.keys(toggleStates).forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option + (toggleStates[option] ? " ✅" : " ❌");
    btn.onclick = () => {
      toggleStates[option] = !toggleStates[option];
      btn.textContent = option + (toggleStates[option] ? " ✅" : " ❌");
    };
    menuPanel.appendChild(btn);
  });

  // Extra controls
  let ctrl = document.createElement("div");
  ctrl.innerHTML = "<br><b>Settings:</b><br>";

  let inp1 = document.createElement("input");
  inp1.placeholder = "Redirect URL";
  inp1.onchange = () => redirectLink = inp1.value;
  ctrl.appendChild(inp1);

  let inp2 = document.createElement("input");
  inp2.type = "number";
  inp2.placeholder = "Max clicks";
  inp2.onchange = () => maxClicks = parseInt(inp2.value) || maxClicks;
  ctrl.appendChild(inp2);

  let inp3 = document.createElement("input");
  inp3.type = "number";
  inp3.placeholder = "Darks per click";
  inp3.onchange = () => darksPerClick = parseInt(inp3.value) || darksPerClick;
  ctrl.appendChild(inp3);

  menuPanel.appendChild(ctrl);
}

// --- Apply toggles to new words ---
function applyAllToggles(word) {
  if (toggleStates.mirrorMode) word.style.transform = "scaleX(-1)";
  if (toggleStates.shakyMode) word.style.animation = "shake 0.5s infinite";
}

updateClicksLeft();


