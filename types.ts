
export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  details: string[];
  stock: number;
  reviews: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
}