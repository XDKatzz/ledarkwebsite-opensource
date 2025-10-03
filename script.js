let count = 0;
let clicksLeft = 1000;
let adminVisible = false;

let darkContainer = document.getElementById("darkContainer");
let clickBtn = document.getElementById("clickBtn");
let counterBtn = document.getElementById("counterBtn");
let adminPanel = document.getElementById("adminPanel");
let closeAdmin = document.getElementById("closeAdmin");
let bottomMessage = document.getElementById("bottomMessage");

// Add Dark functionality
clickBtn.addEventListener("click", () => {
    if(clicksLeft > 0){
        count++; clicksLeft--;
        let dark = document.createElement("span");
        dark.classList.add("darkWord");
        dark.textContent = "Dark";
        let shade = Math.floor((1000-clicksLeft)/1000*255);
        dark.style.color = `rgb(${shade},${shade},${shade})`;
        darkContainer.appendChild(dark);
        counterBtn.textContent = `Clicks left: ${clicksLeft}`;

        if(clicksLeft === 0){
            window.location.href = "https://therapy.com";
        }
    }
});

// Admin panel toggle via password
document.addEventListener("keydown", e => {
    // Keep track of last 4 numbers typed
    if(!window.passwordBuffer) window.passwordBuffer = "";
    if(e.key >= "0" && e.key <= "9") window.passwordBuffer += e.key;
    if(window.passwordBuffer.length > 4) window.passwordBuffer = window.passwordBuffer.slice(-4);

    if(window.passwordBuffer === "2871"){
        adminVisible = !adminVisible;
        adminPanel.style.display = adminVisible ? "block" : "none";
    }
});

// Close button
closeAdmin.addEventListener("click", () => {
    adminVisible = false;
    adminPanel.style.display = "none";
    bottomMessage.textContent = "Admin closed";
    bottomMessage.style.display = "block";
    setTimeout(()=>bottomMessage.style.display="none",1500);
});
