import cx from 'classnames';
import * as React from 'react';
import { Food } from '../type';
import classes from './order-item.module.scss';

interface OrderItemProps {
  type: Food;
  isSelected: boolean;
}

export const OrderItem: React.FC<OrderItemProps> = ({ type, isSelected }) => {
  return (
    <div className={cx(classes.item, isSelected && classes.selected)}>
      <img src={`/${type}.png`} alt={type} height={40} />
    </div>
  );
};
