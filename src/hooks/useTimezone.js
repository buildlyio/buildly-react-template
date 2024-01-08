import { useStore } from '../zustand/timezone/timezoneStore';

const useTimezone = () => {
  const { setTimezone } = useStore();

  const timezone = (data) => {
    setTimezone(data);
  };

  return { timezone };
};

export default useTimezone;
