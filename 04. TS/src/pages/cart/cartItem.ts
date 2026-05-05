
import type { Product } from "../../types/producto";

export interface CartItem extends Product {
  quantity: number;
}