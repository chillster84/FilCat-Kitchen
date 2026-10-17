import { store } from "../state/store.js";

const CATEGORIES = ["All", "Poultry", "Beef/Pork", "Seafood", "Pasta", "Baking", "Breakfast", "Vegetarian", "Quick (<30m)"];

export function renderCategoryPills(container) {
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-pill ${store.activeCategory === cat ? 'active' : ''}" data-cat="${cat}">${cat}</button>
  `).join("");

  container.querySelectorAll(".cat-pill").forEach(btn => {
    btn.onclick = () => store.setActiveCategory(btn.dataset.cat);
  });
}
