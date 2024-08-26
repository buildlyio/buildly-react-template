import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create((set) => ({
  data: [],
  setData: (data) => {
    set({ data });
  },
}));

export { useStore };
