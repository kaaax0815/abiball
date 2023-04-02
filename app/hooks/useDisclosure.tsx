import { useCallback, useState } from 'react';

export default function useDisclosure(isOpenDefault = false) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback((toSet?: boolean) => {
    if (toSet === undefined) {
      setIsOpen((state) => !state);
    } else {
      setIsOpen(toSet);
    }
  }, []);

  return { isOpen, open, close, toggle };
}
