let clicksLeft = 1000;
let adminEnabled = false;
let keypadInput = "";
let sfxEnabled = false;
let musicEnabled = false;

const darkBtn = document.getElementById("darkBtn");
const counterDisplay = document.getElementById("counterDisplay");
const adminPanel = document.getElementById("adminPanel");
const adminClose = document.getElementById("adminClose");
const keypadDisplay = document.getElementById("keypadDisplay");
const title = document.getElementById("title");
const sfxBtn = document.getElementById("sfxBtn");
const musicBtn = document.getElementById("musicBtn");

// Add Dark Counter
darkBtn.addEventListener("click", () => {
  if (clicksLeft > 0) {
    clicksLeft--;
    counterDisplay.textContent = "Clicks left: " + clicksLeft;
  }
});

// SFX toggle
sfxBtn.addEventListener("click", () => {
  sfxEnabled = !sfxEnabled;
  sfxBtn.textContent = "Sound FX: " + (sfxEnabled ? "ON" : "OFF");
});

// Music toggle
musicBtn.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  musicBtn.textContent = "Music: " + (musicEnabled ? "ON" : "OFF");
});

// Keypad
document.querySelectorAll("#keypad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const val = btn.textContent;

    if (val === "C") {
      keypadInput = "";
    } else if (val === "E") {
      if (keypadInput === "8440") {
        adminEnabled = !adminEnabled;
        title.textContent = adminEnabled ? "Admin Mode ✅" : "le dark ✅";
      }
      if (keypadInput === "2871") {
        adminPanel.style.display = "flex";
      }
      keypadInput = "";
    } else {
      keypadInput += val;
    }
    keypadDisplay.textContent = keypadInput;
  });
});

// Close button
adminClose.addEventListener("click", () => {
  adminPanel.style.display = "none";
});
