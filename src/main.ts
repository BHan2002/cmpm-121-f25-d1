import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Monke Clicker: <img src="${exampleIconUrl}" class="icon" /></p>
  <div class="controls">
    <button class="btn" id="likeBtn">
      <span aria-hidden="true">🐵</span>
      <span class="btn-label">Monke</span>
    </button>
    <span class="counter" id="counter" role="status" aria-live="polite">0</span>
    <span class="counter" id="rateCounter" role="status" aria-live="polite">0</span>
  </div>
`;

// Incrementing counter logic using requestAnimationFrame
const btn = document.getElementById("likeBtn") as HTMLButtonElement | null;
const counter = document.getElementById("counter");
rateCounter.textContent = `🐵Rate: 0.00/s`
let count = 0;  

let RATE_PER_SECOND = 0;

let rafId: number | null = null;
let lastTs: number | null = null;
// =====================
// Animation Loop - Makes 'number go up' smooth
// =====================
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

// =====================
// Click button logic - Counter increment on button click
// =====================
if (btn && counter) {
  btn.addEventListener("click", () => {
    count += 1;
    if (counter) counter.textContent = String(count);
  });
}
// =====================
// UpgradeButton Class
// =====================
class UpgradeButton {
  element: HTMLButtonElement;
  cost: number;
  rateIncrease: number;
  label: string;

  constructor(label: string, emoji: string, cost: number, rateIncrease: number) {
    this.label = label;
    this.cost = cost;
    this.rateIncrease = rateIncrease;

    this.element = document.createElement("button");
    this.element.className = "btn";
    this.element.innerHTML = `
      <span aria-hidden="true">${emoji}</span>
      <span class="btn-label">${label + ":" + " " + cost + "🐵"}</span>
    `;
    
    this.element.disabled = true;
    document.body.appendChild(this.element);

    this.element.addEventListener("click", () => this.onClick());
    this.startCostCheck();
  }
  
  startCostCheck() {
    // Enable or disable depending on player’s money
    setInterval(() => {
      this.element.disabled = count < this.cost;
    }, 100);
  }
  
  onClick() {
    if (count >= this.cost) {
      count -= this.cost;
      RATE_PER_SECOND += this.rateIncrease;
      if (counter) counter.textContent = count.toFixed(2);
      if (rateCounter) rateCounter.textContent = `🐵Rate: ${RATE_PER_SECOND.toFixed(2)}/s`;
      // Update Cost of upgrades
      this.cost *= 1.15;
      // If cost is >=100 compact the cost
      const displayCost = this.cost >= 1000
      ? Intl.NumberFormat("en", { notation: "compact" }).format(this.cost)
      : this.cost.toFixed(2);
      this.element.innerHTML = `
      <span class="btn-label">${this.label}: ${displayCost} 🐵</span>
      `;

      startIncreasing();
    } else {
      alert(`Not enough monke! You need at least ${this.cost} monke for ${this.label}.`);
    }
  }
}
// =====================
// Create Upgrades
// =====================
let bananaUpCost = 10;
let farmUpCost = 100;
let factoryUpCost = 1000;
const bananaUpgrade = new UpgradeButton("Banana", "🍌", 10, 0.1);
const farmUpgrade = new UpgradeButton("Farm", "🌴", 100, 2);
const factoryUpgrade = new UpgradeButton("Factory", "🏭", 1000, 50);
