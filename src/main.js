import { store } from "./state/store.js";
import { initRecipeSync, saveRecipeItem } from "./services/db.js";
import { parseMessyNote } from "./services/noteParser.js";
import { renderCategoryPills } from "./components/CategoryPills.js";
import { renderRecipeCard } from "./components/RecipeCard.js";
import { renderRecipeDetail } from "./components/RecipeDetail.js";
import { isCloudEnabled } from "./config/firebase.js";

const app = document.getElementById("app");

// Sync indicator
document.getElementById("sync-status").innerText = isCloudEnabled ? "☁️ Cloud Synced" : "💾 Local Storage";

// Subscribe to database changes
initRecipeSync((list) => {
  if (!list.length && !localStorage.getItem("filcat_initialized")) {
    const starter = {
      id: "rec-" + Date.now(),
      title: "Classic Diner Pancakes",
      category: "Breakfast",
      servings: 4,
      time: "20 mins",
      ingredients: ["2 cups flour", "1 1/2 cups milk", "2 eggs", "1/2 tsp salt", "2 tbsp melted butter"],
      steps: ["Mix dry ingredients.", "Whisk milk and eggs.", "Combine gently.", "Cook on buttered skillet."],
      notes: "Great with blueberries added directly on skillet.",
      lastCooked: null,
      timesCooked: 0
    };
    saveRecipeItem(starter);
    localStorage.setItem("filcat_initialized", "true");
  }
  store.setRecipes(list);
});

// State change re-render
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

    filtered.forEach(r => {
      cardsContainer.appendChild(renderRecipeCard(r));
    });
  } else {
    listSection.classList.add("hidden");
    detailSection.classList.remove("hidden");
    renderRecipeDetail(detailSection);
  }
});

// Note Importer Handlers
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
    store.openDetail(parsed.id);
  }
};
