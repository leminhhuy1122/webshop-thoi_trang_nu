export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export let categories: Category[] = [
  { id: "cat-1", name: "Áo Khoác", createdAt: new Date().toISOString() },
  { id: "cat-2", name: "Quần", createdAt: new Date().toISOString() }
];

export const setCategories = (newCategories: Category[]) => {
  categories = newCategories;
};
