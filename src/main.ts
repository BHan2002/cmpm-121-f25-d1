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

// Incrementing counter logic
const btn = document.getElementById("likeBtn") as HTMLButtonElement | null;
const counter = document.getElementById("counter");
let count = 0;
if (btn && counter) {
  btn.addEventListener("click", () => {
    count += 1;
    counter.textContent = String(count);
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 120);
  });
}
