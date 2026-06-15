import { useCallback, useState, useRef, useEffect } from 'react';

export function useDrawerState(initialValue = null) {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef(null);

  const open = useCallback((nextValue = true) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setValue(nextValue);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    timerRef.current = setTimeout(() => {
      setValue(null);
    }, 400); // 400ms delay to allow drawer closing animation to finish
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    value,
    isOpen,
    open,
    close,
    setValue, // In case manual override is needed
  };
}
