import { create } from 'zustand';

interface CartItem {
  id: string;
  productId: string;
  productSizeId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl: string;
    brand: string;
  };
  productSize: {
    size: string;
  };
}

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  totalCount: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  totalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
}));