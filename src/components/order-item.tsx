import * as React from 'react';
import { Food } from '../type';

interface OrderItemProps {
  type: Food;
  isSelected: boolean;
}

export const OrderItem: React.FC<OrderItemProps> = ({ type, isSelected }) => {
  return (
    <div className={`order-item ${isSelected ? 'order-item--selected' : ''}`}>
      <img src={`/${type}.png`} alt={type} height={80} />
    </div>
  );
};
