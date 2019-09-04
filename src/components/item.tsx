import cx from 'classnames';
import * as React from 'react';
import { randomInt } from '../lib/random';
import { Food } from '../type';
import classes from './item.module.scss';

interface ItemProps {
  type: Food;
  onClick: () => void;
  matched: boolean;
}

export const Item: React.FC<ItemProps> = ({ type, onClick, matched }) => {
  const [hidden, setHidden] = React.useState(false);
  const [hit, setHit] = React.useState<boolean | null>(null);
  const [left] = React.useState(() => randomInt(80) + '%');

  return (
    <div
      className={cx(classes.item, hit !== null && classes.clicked)}
      onClick={() => {
        onClick();
        setHit(matched);
      }}
      onAnimationEnd={() => setHidden(true)}
      hidden={hidden}
      style={{
        left,
      }}
    >
      <img alt={type} src={`/${type}.png`} height={80} />
      {hit !== null && (
        <span
          className={`${classes.marks} ${hit ? classes.green : classes.red}`}
        >
          {hit ? '+1' : '-1'}
        </span>
      )}
    </div>
  );
};
