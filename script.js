// =======================
// GLOBAL VARIABLES
// =======================
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
let secretTopBtn = document.getElementById("secretTopBtn");
let title = document.querySelector("h1");

// Backgrounds list
const backgrounds = [
    "linear-gradient(270deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00ab)",
    "radial-gradient(circle, #1e3c72, #2a5298)",
    "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    "linear-gradient(45deg, #ff6ec4, #7873f5)",
    "linear-gradient(120deg, #f6d365, #fda085)",
    "linear-gradient(200deg, #00c9ff, #92fe9d)",
    "linear-gradient(160deg, #ff4e50, #f9d423)",
    "linear-gradient(60deg, #232526, #414345)"
];
let currentBackground = "";

// =======================
// INITIALIZE
// =======================

// Random background on load
function setRandomBackground() {
    currentBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.background = currentBackground;
    document.body.style.backgroundSize = "400% 400%";
}
setRandomBackground();

// Prevent text selection
document.body.style.userSelect = "none";

// =======================
// CLICK HANDLER
// =======================
clickBtn.addEventListener("click", () => {
    if (adminUnlocked) {
        keypad.style.display = "none";
    }

    if (clicksLeft > 0) {
        count++;
        clicksLeft--;

        // Create Dark word
        let dark = document.createElement("span");
        dark.classList.add("darkWord");
        dark.textContent = "Dark";
        dark.style.color = `rgb(${clicksLeft/4}, ${clicksLeft/4}, ${clicksLeft/4})`;
        darkContainer.appendChild(dark);

        // Apply active toggles
        applyToggles(dark);

        counterBtn.textContent = `Clicks left: ${clicksLeft}`;

        if (clicksLeft === 0) {
            window.location.href = "https://therapy.com";
        }
    }
});

// =======================
// KEYPAD HANDLING
// =======================
function createKeypad() {
    keypad.innerHTML = "";
    let keys = ["1","2","3","4","5","6","7","8","9","0","C","E"];
    keys.forEach(k=>{
        let btn = document.createElement("button");
        btn.textContent = k;
        btn.addEventListener("click", ()=>handleKeypadPress(k));
        keypad.appendChild(btn);
    });
}
createKeypad();

function handleKeypadPress(key) {
    if (key === "C") {
        passwordInput = "";
    } else if (key === "E") {
        checkPassword(passwordInput);
        passwordInput = "";
    } else if (passwordInput.length < 4) {
        passwordInput += key;
    }
}

// =======================
// PASSWORD CHECKS
// =======================
function checkPassword(pw) {
    if (pw === "8440") {
        adminUnlocked = !adminUnlocked;
        if (adminUnlocked) {
            title.textContent = "le dark ✅";
            secretTopBtn.style.display = "block";
            confettiExplosion();
        } else {
            title.textContent = "le dark";
            menuPanel.style.display = "none";
        }
    } else if (pw === "2871" && adminUnlocked) {
        // Toggle secret button controlling menu
        secretTopBtn.style.display = "block";
    } else {
        alert("Denied!");
    }
}

// =======================
// SECRET BUTTON TOGGLE MENU
// =======================
secretTopBtn.addEventListener("click", () => {
    if (adminUnlocked) {
        menuPanel.style.display = (menuPanel.style.display === "block") ? "none" : "block";
        showMenu();
    }
});

// =======================
// ADMIN MENU
// =======================
function showMenu() {
    menuPanel.innerHTML = "<h2>Admin Menu</h2>";

    // Toggle features
    const features = [
        "Rainbow Cycle","Glow Aura","Rotate Spin","Floating Drift",
        "Chaos Shake","Seal Spam","Dark Rain"
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

    // Background selector
    let bgLabel = document.createElement("p");
    bgLabel.textContent = "Background Themes:";
    menuPanel.appendChild(bgLabel);
    backgrounds.forEach((bg,i)=>{
        let btn = document.createElement("button");
        btn.textContent = "Theme "+(i+1);
        btn.addEventListener("click", ()=>{
            document.body.style.background = bg;
        });
        menuPanel.appendChild(btn);
    });
}

// =======================
// APPLY TOGGLES
// =======================
function applyToggles(el) {
    if(toggleStates["Rainbow Cycle"]) el.classList.add("rainbow");
    if(toggleStates["Glow Aura"]) el.classList.add("glow");
    if(toggleStates["Rotate Spin"]) el.classList.add("spin");
    if(toggleStates["Floating Drift"]) el.classList.add("float");
    if(toggleStates["Chaos Shake"]) el.classList.add("chaos");

    if(toggleStates["Seal Spam"]) {
        let seal = document.createElement("span");
        seal.textContent = "🦭";
        seal.style.position = "absolute";
        seal.style.left = Math.random()*window.innerWidth+"px";
        seal.style.top = Math.random()*window.innerHeight+"px";
        document.body.appendChild(seal);
        setTimeout(()=>seal.remove(),2000);
    }

    if(toggleStates["Dark Rain"]) {
        let drop = document.createElement("div");
        drop.textContent = "Dark";
        drop.classList.add("rainDrop");
        drop.style.left = Math.random()*window.innerWidth+"px";
        document.body.appendChild(drop);
        setTimeout(()=>drop.remove(),4000);
    }
}

// =======================
// FUN CONFETTI
// =======================
function confettiExplosion() {
    for(let i=0;i<30;i++){
        let conf = document.createElement("div");
        conf.classList.add("confetti");
        conf.style.left = Math.random()*100+"vw";
        conf.style.backgroundColor = `hsl(${Math.random()*360},100%,50%)`;
        document.body.appendChild(conf);
        setTimeout(()=>conf.remove(),1500);
    }
}
