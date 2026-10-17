import { db, isCloudEnabled } from "../config/firebase.js";
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const LOCAL_KEY = "filcat_recipes";

export function initRecipeSync(onUpdate) {
  if (isCloudEnabled && db) {
    const colRef = collection(db, "recipes");
    return onSnapshot(colRef, (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(list);
    });
  } else {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    onUpdate(local);
    return () => {};
  }
}

export async function saveRecipeItem(recipe) {
  if (isCloudEnabled && db) {
    const ref = doc(db, "recipes", recipe.id);
    await setDoc(ref, recipe, { merge: true });
  } else {
    const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    const idx = local.findIndex(r => r.id === recipe.id);
    if (idx >= 0) local[idx] = recipe;
    else local.unshift(recipe);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
  }
}

export async function deleteRecipeItem(id) {
  if (isCloudEnabled && db) {
    await deleteDoc(doc(db, "recipes", id));
  } else {
    let local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    local = local.filter(r => r.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
  }
}
