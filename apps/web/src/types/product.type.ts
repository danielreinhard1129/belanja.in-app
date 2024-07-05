import { CategoriesOnProduct, CategoryIds } from "./category.type";
import { StoreProduct } from "./storeProduct.type";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  weight: number;
  categories: CategoriesOnProduct[];
  images: ProductImage[];
  storeProduct: StoreProduct[]
}

export interface ProductImage {
  id: number;
  images: string;
}

export interface IFormProduct {
  name: string;
  description: string;
  images?: File[];
  categories: CategoryIds[];
  price: number;
  weight: number;
  userId?: number;
}
