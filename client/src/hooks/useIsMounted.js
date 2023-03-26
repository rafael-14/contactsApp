import { useEffect, useRef, useCallback } from 'react';

export default function useIsMounted() {
  const isMounted = useRef(false);

  const getIsMounted = useCallback(() => isMounted.current, []);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return getIsMounted;
}
