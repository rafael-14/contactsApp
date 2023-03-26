import {
  useCallback,
} from 'react';
import useIsMounted from './useIsMounted';

export default function safeAsyncAction() {
  const isMounted = useIsMounted();

  const runSafeAsyncAction = useCallback((callback) => {
    if (isMounted()) callback();
  }, []);

  return runSafeAsyncAction;
}
