import { create } from 'zustand';

const useCartStore = create((set) => ({
  data: [],
  setCart: (data) => {
    set({ data });
  },
}));

export { useCartStore };
