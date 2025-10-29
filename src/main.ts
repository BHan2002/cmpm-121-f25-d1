/*----------------------------------------------------------------------------------*/
// Author: Bryce Han
// Date: 10/12/2025
// Purpose: Using Typescript, CSS, and html skills
//          to learn how to make an incremental clicker game
/*----------------------------------------------------------------------------------*/

import "./style.css";
/* ---------------- TYPES ---------------- */
type ItemEffect =
  | { kind: "rate"; perLevel: number } // increases passive rate
  | { kind: "click"; perLevel: number }; // increases manual click value

interface ItemConfig {
  id: string;
  label: string;
  emoji: string;
  baseCost: number;
  costGrowth: number;
  maxLevel?: number; // optional cap
  effect: ItemEffect;
  description: string;
}
class ShopItem {
  readonly conf: ItemConfig;
  level = 0;
  cost: number;
  button: HTMLButtonElement;
  priceEl: HTMLSpanElement;
  levelEl: HTMLSpanElement;

  constructor(conf: ItemConfig) {
    this.conf = conf;
    this.cost = conf.baseCost;

    const card = document.createElement("div");
    card.className = "shop-item";

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = conf.description;

    this.button = document.createElement("button");
    this.button.className = "clickButton shop-clickButton";
    this.button.id = `item-${conf.id}`;

    const label = document.createElement("span");
    label.className = "clickButton-label";
    label.textContent = `${conf.emoji} ${conf.label}`;

    this.levelEl = document.createElement("span");
    this.levelEl.className = "shop-level";
    this.levelEl.textContent = ` Lv. ${this.level}` + " Cost: ";

    this.priceEl = document.createElement("span");
    this.priceEl.className = "shop-price";
    this.priceEl.textContent = `${fmt(this.cost)} 🐵`;

    this.button.appendChild(label);
    this.button.appendChild(this.levelEl);
    this.button.appendChild(this.priceEl);
    card.appendChild(this.button);
    shop.appendChild(card);
    card.appendChild(tooltip); // Attaches to the wrapper
    shop.appendChild(card);

    this.button.addEventListener("click", () => this.buy());
  }

  canAfford() {
    if (count < this.cost) return false;
    return count >= this.cost;
  }

  buy() {
    if (!this.canAfford()) {
      alert(
        `Not enough monke! Need ${fmt(this.cost)} 🐵 for ${this.conf.label}.`,
      );
      return;
    }

    // pay
    count -= this.cost;

    // apply effect
    if (this.conf.effect.kind === "rate") {
      INCOME_RATE += this.conf.effect.perLevel;
      startIncreasing();
    } else if (this.conf.effect.kind === "click") {
      // If I want to add a click modifier I would put it here :)
    }

    // level up + next cost
    this.level += 1;
    if (this.conf.maxLevel == null || this.level < this.conf.maxLevel) {
      this.cost = parseFloat((this.cost * this.conf.costGrowth).toFixed(2));
    }

    // UI updates
    this.levelEl.textContent = ` Lv. ${this.level} Cost: `;
    this.priceEl.textContent =
      this.conf.maxLevel != null && this.level >= this.conf.maxLevel
        ? "MAX"
        : `${fmt(this.cost)} 🐵`;

    updateCounters();
    this.updateDisabled();
  }

  updateDisabled() {
    const reachedMax = this.conf.maxLevel != null &&
      this.level >= this.conf.maxLevel;
    this.button.disabled = reachedMax || count < this.cost;
  }
}
/*--- STATE ----------------------------------------------------------------------*/
let count = 0;
let INCOME_RATE = 0;
let animationID: number | null = null;
let lastTs: number | null = null;

const clickButton = document.getElementById("monkeclickButton") as
  | HTMLButtonElement
  | null;
const counter = document.getElementById("counter")!;
const rateCounter = document.getElementById("rateCounter")!;
const shop = document.getElementById("shop")!;
/*--- DOM ELEMENTS -------------------------------------------------------------------------*/
document.body.innerHTML = `
  <div class="controls">
    <p>Monke Clicker: </p>
    <button class="clickButton" id="monkeclickButton">
      <span aria-hidden="true">🐵</span>
      <span class="clickButton-label">Monke</span>
    </button>
    <span class="counter" id="counter" role="status" aria-live="polite">0</span>
    <span class="counter" id="rateCounter" role="status" aria-live="polite">0</span>
  </div>
  <section id="shop" aria-label="Upgrades Shop"></section>
`;

/*--- HELPERS ---------------------------------------------------------------*/
const fmt = (n: number, decimals = 2) => n.toFixed(decimals);

function updateCounters() {
  counter.textContent = fmt(count);
  rateCounter.textContent = `🐵Rate: ${fmt(INCOME_RATE)}/s`;
}

function step(now: number) {
  if (lastTs == null) lastTs = now;
  const deltaSec = (now - lastTs) / 1000;
  lastTs = now;
  count += INCOME_RATE * deltaSec;
  updateCounters();
  animationID = requestAnimationFrame(step);
}

function startIncreasing() {
  if (animationID != null) return;
  lastTs = null;
  animationID = requestAnimationFrame(step);
}
/*--- EVENT LISTENERS ---*/
/* Manual click */
if (clickButton && counter) {
  clickButton.addEventListener("click", () => {
    count += 1;
    if (counter) counter.textContent = String(count);
  });
}

/*--- GAME DATA ---*/
const availableItems: ItemConfig[] = [
  {
    id: "banana",
    label: "Banana",
    emoji: "🍌",
    baseCost: 10,
    costGrowth: 1.15,
    effect: { kind: "rate", perLevel: 0.10 },
    description: "Ooooooooh bananaaaah!",
  },
  {
    id: "farm",
    label: "Banana Farm ",
    emoji: "🌴",
    baseCost: 100,
    costGrowth: 1.15,
    effect: { kind: "rate", perLevel: 2.00 },
    description: "Honest working monkes",
  },
  {
    id: "factory",
    label: "Banana Factory ",
    emoji: "🏭",
    baseCost: 1000,
    costGrowth: 1.15,
    effect: { kind: "rate", perLevel: 50.00 },
    description: "It was this or typewriters",
  },
  {
    id: "Banana Labs",
    label: "Banana Labs ",
    emoji: "🧪",
    baseCost: 1500,
    costGrowth: 1.15,
    effect: { kind: "rate", perLevel: 100.00 },
    description: "Mr. Monke, it's time to cook...",
  },
  {
    id: "factory",
    label: "Banana Shrine ",
    emoji: "⛩️",
    baseCost: 2500,
    costGrowth: 1.15,
    effect: { kind: "rate", perLevel: 500.00 },
    description: "Holy bananas? Sign me up :)",
  },
];
/* ---------------- SHOP INIT & LOOP ---------------- */
const shopItems: ShopItem[] = availableItems.map((conf) => new ShopItem(conf));

/* Enable/disable items by looping the array */
setInterval(() => {
  for (const item of shopItems) item.updateDisabled();
}, 100);

/* Keep counters fresh at boot */
updateCounters();

/* ---------------- UI FEATURES ---------------- */
(function mountThemeToggle() {
  const saved = localStorage.getItem("theme");
  const prefersDark = globalThis.matchMedia?.("(prefers-color-scheme: dark)")
    .matches;
  if (saved === "dark" || (!saved && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
  const clickButton = document.createElement("button");
  clickButton.id = "themeToggle";
  clickButton.className = "clickButton";
  const setUI = () => {
    const isDark = document.documentElement.classList.contains("dark");
    clickButton.innerHTML = `<span aria-hidden="true">${
      isDark ? "🌙" : "☀️"
    }</span>
                     <span class="clickButton-label">${
      isDark ? "Dark" : "Light"
    }</span>`;
    clickButton.setAttribute("aria-pressed", isDark ? "true" : "false");
    clickButton.title = "Toggle dark mode";
  };
  setUI();
  clickButton.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setUI();
  });
  document.body.appendChild(clickButton);
})();
