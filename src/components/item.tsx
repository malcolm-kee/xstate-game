import * as React from 'react';
import { randomInt } from '../lib/random';
import { Food } from '../type';

interface ItemProps {
  type: Food;
  onClick: () => void;
}

export const Item: React.FC<ItemProps> = ({ type, onClick }) => {
  const [hidden, setHidden] = React.useState(false);
  const [left] = React.useState(() => randomInt(80) + '%');

  return (
    <div
      className="food-item"
      onClick={() => {
        onClick();
        setHidden(true);
      }}
      onAnimationEnd={() => setHidden(true)}
      hidden={hidden}
      style={{
        left,
      }}
    >
      {type}
    </div>
  );
};
