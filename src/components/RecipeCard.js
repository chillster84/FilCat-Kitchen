import { formatLastCooked } from "../services/cookTracker.js";
import { store } from "../state/store.js";

export function renderRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.onclick = () => store.openDetail(recipe.id);

  const cookedBadge = recipe.lastCooked 
    ? `<span class="cooked-badge">${formatLastCooked(recipe.lastCooked)}</span>` 
    : `<span>Never cooked</span>`;

  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">${recipe.title}</div>
      <div class="card-tag">${recipe.category || 'General'}</div>
    </div>
    <div class="card-meta">
      <span>⏱ ${recipe.time || 'N/A'}</span>
      <span>•</span>
      ${cookedBadge}
    </div>
  `;
  return card;
}
