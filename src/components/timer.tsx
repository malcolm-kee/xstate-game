import * as React from 'react';
import classes from './timer.module.scss';

interface TimerProps {
  remainingMs: number;
}

export const Timer: React.FC<TimerProps> = ({ remainingMs }) => (
  <div>
    <h2 className={classes.label}>TIMER</h2>
    {remainingMs > 0 ? (
      <>
        <h1>
          {remainingMs / 1000} <span className="small-only">sec</span>
        </h1>
        <h2 className={classes.label}>seconds left</h2>
      </>
    ) : (
      <h1 className={classes.label}>Time is up!</h1>
    )}
  </div>
);
