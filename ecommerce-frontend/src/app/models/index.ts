export interface User {
  id?: number;
  email: string;
  fullName?: string;
  role: 'Admin' | 'Customer';
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId?: number;
  categoryID?: number;
  categoryName?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  id: number;
  productId?: number;
  productID?: number;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}

export interface OrderItem {
  id: number;
  productId?: number;
  productID?: number;
  productName: string;
  priceAtTime: number;
  quantity: number;
}

export interface Order {
  id: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  createdAt: string;
  address: string;
  items: OrderItem[];
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
}

export interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productID: number;
  rating: number;
  comment: string;
}

export interface ProductImage {
  id: number;
  productID: number;
  imageUrl: string;
}

