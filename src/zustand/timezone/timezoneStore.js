import create from 'zustand';
import { getUser } from '../../context/User.context';

const useStore = create((set) => ({
  data: getUser() ? getUser().user_timezone : '',
  setTimezone: (data) => {
    set({ data });
  },
}));

export { useStore };
