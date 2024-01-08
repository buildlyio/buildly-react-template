import { useStore } from '../zustand/alert/alertStore';

const useAlert = () => {
  const { showAlert } = useStore();

  const displayAlert = (type, message) => {
    showAlert({
      type,
      message,
      open: true,
    });
  };

  return { displayAlert };
};

export default useAlert;
