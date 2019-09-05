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
  const [calledTimes, setCalledTimes] = React.useState(0);

  /**
   * set the state to a temporary value. The timeout will be extended everytime
   * you call this
   */
  const setTemporaryState = React.useCallback(function setTemporaryState(
    newValue: React.SetStateAction<T>
  ) {
    setState(newValue);
    setCalledTimes(t => t + 1);
  },
  []);

  React.useEffect(() => {
    if (state !== stableState && restorationTimeInMs) {
      const timeoutId = setTimeout(
        () => setState(stableState),
        restorationTimeInMs
      );

      return () => clearTimeout(timeoutId);
    }
  }, [state, stableState, restorationTimeInMs, calledTimes]);

  return [state, setTemporaryState];
};
