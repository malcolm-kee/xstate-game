import * as React from 'react';

interface SequenceProps {
  /**
   * Total time for the sequence is millisecond. The time will be distributed equally among children
   */
  totalTime: number;
}

/**
 * `Sequence` is a component that will render its child sequentially.
 */
export const Sequence: React.FC<SequenceProps> = ({ totalTime, children }) => {
  const childrenCount = React.Children.count(children);
  const timeForEachChild = childrenCount && totalTime / childrenCount;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (childrenCount > currentIndex + 1) {
      const timeoutId = setTimeout(
        () => setCurrentIndex(currentIndex + 1),
        timeForEachChild
      );

      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, timeForEachChild, childrenCount]);

  return (
    <>
      {React.Children.toArray(children).filter(
        (_, index) => index === currentIndex
      )}
    </>
  );
};
