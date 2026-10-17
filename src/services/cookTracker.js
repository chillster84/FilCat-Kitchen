export function formatLastCooked(timestamp) {
  if (!timestamp) return "Never cooked";
  const diffDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Cooked today!";
  if (diffDays === 1) return "Cooked yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return `Over a month ago`;
}
