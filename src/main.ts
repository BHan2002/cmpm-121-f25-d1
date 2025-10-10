import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
  <div class="controls">
    <button class="btn" id="likeBtn">
      <span aria-hidden="true">🐵</span>
      <span class="btn-label">Monke</span>
    </button>
    <span class="counter" id="counter" role="status" aria-live="polite">0</span>
  </div>
`;

// Incrementing counter logic using requestAnimationFrame
const btn = document.getElementById("likeBtn") as HTMLButtonElement | null;
const counter = document.getElementById("counter");
let count = 0;

// Rate: 1 unit per second total
let RATE_PER_SECOND = 0;

let rafId: number | null = null;
let lastTs: number | null = null;

function step(now: number) {
  if (lastTs == null) lastTs = now;
  const deltaMs = now - lastTs;
  lastTs = now;
  // convert ms -> seconds
  const deltaSec = deltaMs / 1000;
  // increase by RATE_PER_SECOND * elapsedSeconds
  count += RATE_PER_SECOND * deltaSec;
  if (counter) counter.textContent = count.toFixed(2);
  rafId = requestAnimationFrame(step);
}

function startIncreasing() {
  if (rafId != null) return; // already running
  lastTs = null;
  rafId = requestAnimationFrame(step);
}
// Counter increment on button click
if (btn && counter) {
  btn.addEventListener("click", () => {
    count += 1;
    if (counter) counter.textContent = String(count);
  });
}

// New upgrade button to click to increase continuous increment by 1 unit per second
const upgradeBtn = document.createElement("button");
upgradeBtn.className = "btn";
upgradeBtn.id = "upgradeBtn";
upgradeBtn.innerHTML = `
  <span aria-hidden="true">🍌</span>
  <span class="btn-label">Upgrade</span>
`;
document.body.appendChild(upgradeBtn);
// Initial state: button is disabled
upgradeBtn.disabled = true;

// Enable button if user can afford upgrade (10 units)
setInterval(() => {
  if (count >= 10) {
    upgradeBtn.disabled = false;
  } else {
    upgradeBtn.disabled = true;
  }
}, 100);

// Upgrade button click event
upgradeBtn.addEventListener("click", () => {
  // Start continuous increment
  // Subtract cost of upgrade (10 units)
  if (count >= 10) {
    count -= 10;
    if (counter) counter.textContent = count.toFixed(2);
    // Increment rate by 1 unit per second
    RATE_PER_SECOND += 1;
    startIncreasing();
  } else {
    alert("Not enough monke! You need at least 10 monke to upgrade.");
  }
});
