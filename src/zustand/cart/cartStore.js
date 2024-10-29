import { create } from 'zustand';

const useCartStore = create((set) => ({
  data: JSON.parse(localStorage.getItem('cart')) || [],
  setCart: (data) => {
    localStorage.setItem('cart', JSON.stringify(data));
    set({ data });
  },
}));

export { useCartStore };
