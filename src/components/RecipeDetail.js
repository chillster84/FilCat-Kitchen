import { store } from "../state/store.js";
import { scaleLine } from "../services/scaler.js";
import { saveRecipeItem, deleteRecipeItem } from "../services/db.js";
import { formatLastCooked } from "../services/cookTracker.js";

export function renderRecipeDetail(container) {
  const recipe = store.recipes.find(r => r.id === store.activeRecipeId);
  if (!recipe) return store.showList();

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
      <button class="btn btn-secondary btn-sm" id="btn-back">← All Recipes</button>
      <div style="display:flex; gap:6px;">
        <button class="btn btn-green btn-sm" id="btn-cooked">🍳 Cooked Today!</button>
        <button class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
      </div>
    </div>

    <h2 style="font-size:1.6rem; font-weight:800; margin-bottom:6px;">${recipe.title}</h2>
    <div class="card-meta" style="margin-bottom:16px;">
      <span class="card-tag">${recipe.category}</span>
      <span>⏱ ${recipe.time}</span>
      <span class="cooked-badge">${formatLastCooked(recipe.lastCooked)}</span>
    </div>

    <!-- SCALER -->
    <div class="scaler-container">
      <div class="scaler-header">
        <div class="scaler-title">Recipe Scale</div>
        <span style="font-weight:700; color:var(--primary); font-size:0.9rem;">${store.currentScale}x Multiplier</span>
      </div>
      <div class="scale-btn-group">
        <button class="scale-opt-btn ${store.currentScale === 0.5 ? 'active' : ''}" data-scale="0.5">0.5x</button>
        <button class="scale-opt-btn ${store.currentScale === 1 ? 'active' : ''}" data-scale="1">1x</button>
        <button class="scale-opt-btn ${store.currentScale === 1.5 ? 'active' : ''}" data-scale="1.5">1.5x</button>
        <button class="scale-opt-btn ${store.currentScale === 2 ? 'active' : ''}" data-scale="2">2x</button>
        <button class="scale-opt-btn ${store.currentScale === 3 ? 'active' : ''}" data-scale="3">3x</button>
      </div>
    </div>

    <h3 style="margin:20px 0 10px; font-weight:800;">Ingredients</h3>
    <div style="border:1px solid var(--border); border-radius:var(--radius); overflow:hidden;">
      ${recipe.ingredients.map(ing => `
        <div class="ingredient-row">
          <span>${scaleLine(ing, store.currentScale)}</span>
        </div>
      `).join("")}
    </div>

    <h3 style="margin:24px 0 10px; font-weight:800;">Instructions</h3>
    <ol style="padding-left:18px;">
      ${recipe.steps.map(s => `<li class="step-row">${s}</li>`).join("")}
    </ol>

    <!-- INLINE CHEF SCRATCHPAD -->
    <div class="scratchpad-box">
      <div style="font-weight:800; font-size:0.85rem; color:#854d0e; text-transform:uppercase; margin-bottom:6px;">Chef's Kitchen Scratchpad</div>
      <textarea id="scratchpad-input" placeholder="Quick notes while cooking... (auto-saves)">${recipe.notes || ''}</textarea>
    </div>
  `;

  container.querySelector("#btn-back").onclick = () => store.showList();
  
  container.querySelector("#btn-cooked").onclick = async () => {
    recipe.lastCooked = Date.now();
    recipe.timesCooked = (recipe.timesCooked || 0) + 1;
    await saveRecipeItem(recipe);
    renderRecipeDetail(container);
  };

  container.querySelector("#btn-delete").onclick = async () => {
    if (confirm("Delete this recipe?")) {
      await deleteRecipeItem(recipe.id);
      store.showList();
    }
  };

  container.querySelectorAll(".scale-opt-btn").forEach(btn => {
    btn.onclick = () => store.setScale(parseFloat(btn.dataset.scale));
  });

  const pad = container.querySelector("#scratchpad-input");
  pad.onblur = async () => {
    recipe.notes = pad.value;
    await saveRecipeItem(recipe);
  };
}
