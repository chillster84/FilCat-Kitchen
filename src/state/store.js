export const store = {
  recipes: [],
  activeRecipeId: null,
  activeCategory: "All",
  currentScale: 1,
  view: "list", // 'list' | 'detail'
  listeners: [],

  subscribe(fn) {
    this.listeners.push(fn);
  },
  notify() {
    this.listeners.forEach(fn => fn(this));
  },
  setRecipes(list) {
    this.recipes = list;
    this.notify();
  },
  setActiveCategory(cat) {
    this.activeCategory = cat;
    this.notify();
  },
  openDetail(id) {
    this.activeRecipeId = id;
    this.currentScale = 1;
    this.view = "detail";
    this.notify();
  },
  showList() {
    this.view = "list";
    this.notify();
  },
  setScale(scale) {
    this.currentScale = scale;
    this.notify();
  }
};
