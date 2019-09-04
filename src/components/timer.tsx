import * as React from 'react';

interface TimerProps {
  remainingMs: number;
}

export const Timer: React.FC<TimerProps> = ({ remainingMs }) => (
  <div>
    <h2>TIMER</h2>
    {remainingMs > 0 ? (
      <>
        <h1>{remainingMs / 1000}</h1>
        <h2>seconds left</h2>
      </>
    ) : (
      <h1>Time is up!</h1>
    )}
  </div>
);
