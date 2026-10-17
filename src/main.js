import { store } from "./state/store.js";
import { initRecipeSync, saveRecipeItem } from "./services/db.js";
import { parseMessyNote } from "./services/noteParser.js";
import { renderCategoryPills } from "./components/CategoryPills.js";
import { renderRecipeCard } from "./components/RecipeCard.js";
import { renderRecipeDetail } from "./components/RecipeDetail.js";
import { isCloudEnabled } from "./config/firebase.js";

// 1. Sync Indicator
const syncBadge = document.getElementById("sync-status");
if (syncBadge) {
  syncBadge.innerText = isCloudEnabled ? "☁️ Cloud Synced" : "💾 Local Storage";
}

// 2. Set up the UI Listener FIRST so it catches the data immediately
store.subscribe(() => {
  const listSection = document.getElementById("section-list");
  const detailSection = document.getElementById("section-detail");

  if (store.view === "list") {
    listSection.classList.remove("hidden");
    detailSection.classList.add("hidden");

    renderCategoryPills(document.getElementById("category-container"));

    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = "";

    const filtered = store.recipes.filter(r => {
      return store.activeCategory === "All" || r.category === store.activeCategory;
    });

    if (filtered.length === 0) {
      cardsContainer.innerHTML = `
        <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
          <p>No recipes in this category yet!</p>
          <p style="font-size:0.85rem; margin-top:6px;">Tap <strong>📋 Paste Note</strong> to add one.</p>
        </div>
      `;
    } else {
      filtered.forEach(r => {
        cardsContainer.appendChild(renderRecipeCard(r));
      });
    }
  } else {
    listSection.classList.add("hidden");
    detailSection.classList.remove("hidden");
    renderRecipeDetail(detailSection);
  }
});

// 3. Connect to Database / LocalStorage with Starter Recipe
initRecipeSync((list) => {
  if (!list || list.length === 0) {
    const starter = {
      id: "rec-" + Date.now(),
      title: "Classic Diner Pancakes",
      category: "Breakfast",
      servings: 4,
      time: "20 mins",
      ingredients: [
        "2 cups flour",
        "1 1/2 cups milk",
        "2 eggs",
        "1/2 tsp salt",
        "2 tbsp melted butter"
      ],
      steps: [
        "Whisk dry ingredients together in a large bowl.",
        "In a separate bowl, beat milk, eggs, and melted butter.",
        "Gently combine wet and dry ingredients (small lumps are fine).",
        "Cook on a hot, buttered skillet until bubbles appear on top, flip and finish."
      ],
      notes: "Chef tip: Toss blueberries directly onto the uncooked side before flipping.",
      lastCooked: null,
      timesCooked: 0
    };
    saveRecipeItem(starter);
    list = [starter];
  }
  store.setRecipes(list);
});

// 4. Note Importer Modal Actions
const importModal = document.getElementById("modal-import");
document.getElementById("btn-open-import").onclick = () => importModal.classList.remove("hidden");
document.getElementById("btn-close-import").onclick = () => importModal.classList.add("hidden");

document.getElementById("btn-run-import").onclick = async () => {
  const raw = document.getElementById("input-raw-notes").value;
  const parsed = parseMessyNote(raw);
  if (parsed) {
    parsed.id = "rec-" + Date.now();
    await saveRecipeItem(parsed);
    importModal.classList.add("hidden");
    document.getElementById("input-raw-notes").value = "";
    store.openDetail(parsed.id );
  }
};
