import { db } from "../config/firebase.js";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const STARTER_RECIPE = {
  id: "rec-pancakes",
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
    "Gently combine wet and dry ingredients.",
    "Cook on buttered skillet until bubbles appear on top, flip and finish."
  ],
  notes: "Chef tip: Toss blueberries directly onto the uncooked side before flipping.",
  lastCooked: null,
  timesCooked: 0
};

let hasSeeded = false;

export function initRecipeSync(onUpdate) {
  const colRef = collection(db, "recipes");
  
  return onSnapshot(colRef, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    // If your cloud database is totally empty, automatically seed the starter recipe
    if (list.length === 0 && !hasSeeded) {
      hasSeeded = true;
      saveRecipeItem(STARTER_RECIPE);
      return;
    }

    onUpdate(list);
  }, (err) => {
    console.error("Firestore sync error:", err);
  });
}

export async function saveRecipeItem(recipe) {
  const ref = doc(db, "recipes", recipe.id);
  await setDoc(ref, recipe, { merge: true });
}

export async function deleteRecipeItem(id) {
  await deleteDoc(doc(db, "recipes",  id));
}
