import { useEffect, useState } from 'react';
import { DEFAULT_DELAY } from '../constants';

const useDebouncedValue = (value = '', delay = DEFAULT_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebouncedValue;
