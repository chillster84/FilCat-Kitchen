export function parseMessyNote(rawText) {
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
  if (!lines.length) return null;

  const title = lines[0].replace(/^#+\s*/, "").slice(0, 60);
  const ingredients = [];
  const steps = [];

  let inSteps = false;
  const measureWords = ["cup", "cups", "tbsp", "tsp", "oz", "lb", "g", "ml", "pinch", "clove", "cloves", "can"];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    if (lower.includes("instruction") || lower.includes("directions") || lower.includes("steps:") || lower.includes("method:")) {
      inSteps = true;
      continue;
    }

    const startsWithNumber = /^(\d|\d\/\d)/.test(line);
    const hasMeasure = measureWords.some(w => lower.includes(w));

    if (inSteps || (!hasMeasure && !startsWithNumber && line.length > 35)) {
      steps.push(line.replace(/^\d+[\.\)]\s*/, ""));
    } else {
      ingredients.push(line.replace(/^[-*•]\s*/, ""));
    }
  }

  let category = "General";
  const fullText = rawText.toLowerCase();
  if (fullText.includes("chicken") || fullText.includes("turkey")) category = "Poultry";
  else if (fullText.includes("beef") || fullText.includes("steak") || fullText.includes("pork")) category = "Beef/Pork";
  else if (fullText.includes("salmon") || fullText.includes("shrimp") || fullText.includes("fish")) category = "Seafood";
  else if (fullText.includes("pasta") || fullText.includes("spaghetti")) category = "Pasta";
  else if (fullText.includes("flour") && (fullText.includes("bake") || fullText.includes("cookie") || fullText.includes("cake"))) category = "Baking";
  else if (fullText.includes("egg") || fullText.includes("pancake")) category = "Breakfast";

  return {
    title: title || "New Recipe",
    category,
    servings: 4,
    time: "30 mins",
    ingredients: ingredients.length ? ingredients : ["1 portion main ingredient"],
    steps: steps.length ? steps : ["Cook ingredients until ready."],
    notes: ""
  };
}
