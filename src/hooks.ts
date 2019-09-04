import * as React from 'react';

/**
 * declare a state that will restore to a stable state after timeout if you attempt to update it to other value
 * @param stableState the state value that will will be restored to after restoration time
 * @param restorationTimeInMs time required to restore to stableState
 */
export const useTransientState = <T>(
  stableState: T,
  restorationTimeInMs: number = 2000
): [T, (val: React.SetStateAction<T>) => void] => {
  const [state, setState] = React.useState(stableState);
  const timeoutId = React.useRef<number | null>(null);

  const setTemporaryState = React.useCallback(function setTemporaryState(
    newValue: React.SetStateAction<T>
  ) {
    setState(newValue);
  },
  []);

  React.useEffect(() => {
    if (state !== stableState && restorationTimeInMs) {
      timeoutId.current = setTimeout(
        () => setState(stableState),
        restorationTimeInMs
      );

      return () => {
        timeoutId.current && clearTimeout(timeoutId.current);
      };
    }
  }, [state, stableState, restorationTimeInMs]);

  return [state, setTemporaryState];
};
