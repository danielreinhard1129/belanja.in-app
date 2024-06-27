export interface Category {
  id: number;
  name: string;
}

export interface IFormCategory {
  name: string;
  userId?: number;
}

export interface CategoryIds {
  value: string;
  label: string;
}

export interface CategoriesOnProduct {
  categoryId: number;
  productId: number;
  category: Category;
}
