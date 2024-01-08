import create from 'zustand';

const useStore = create((set) => ({
  data: null,
  showAlert: (data) => {
    set({ data });
  },
  hideAlert: () => {
    set({ data: null });
  },
}));

export { useStore };
