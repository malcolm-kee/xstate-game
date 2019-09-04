import { useMachine } from '@xstate/react';
import * as React from 'react';
import './App.css';
import { Item } from './components/item';
import { gameMachine } from './machine';
import { Food } from './type';
import { OrderItem } from './components/order-item';

export const App = () => {
  const [items, setItems] = React.useState<Food[]>([]);
  const machine = React.useMemo(
    () =>
      gameMachine.withConfig({
        activities: {
          spawnItem: context => {
            let index = 0;
            let timeoutId: number;

            function spawn() {
              setItems(currentItems =>
                currentItems.concat(context.data.items[index])
              );
              index++;
              if (context.data.items.length > index) {
                timeoutId = setTimeout(spawn, 1000);
              }
            }

            timeoutId = setTimeout(spawn, 1000);

            return () => clearTimeout(timeoutId);
          },
        },
      }),
    []
  );
  const [{ context, value: gameState }, send] = useMachine(machine);

  const orderItems = React.useMemo(() => {
    const allOrderItems = (
      context.data.orders[context.result.currentOrder] || []
    ).slice();
    const selectedItems: Food[] = [];

    context.result.selectedItem.forEach(selected => {
      const [selectedItem] = allOrderItems.splice(
        allOrderItems.indexOf(selected),
        1
      );
      selectedItems.push(selectedItem);
    });

    return selectedItems
      .map(food => ({ food, selected: true }))
      .concat(allOrderItems.map(food => ({ food, selected: false })));
  }, [
    context.data.orders,
    context.result.currentOrder,
    context.result.selectedItem,
  ]);

  return (
    <div className="App">
      <div>
        {gameState === 'landing' && (
          <button onClick={() => send('START')}>Start</button>
        )}
        {gameState === 'playing' && (
          <div className="game-panel">
            <div style={{ background: '#bbb', position: 'relative' }}>
              {items.map((item, i) => (
                <Item
                  onClick={() => send({ type: 'SELECT_FOOD', food: item })}
                  type={item}
                  key={i}
                />
              ))}
            </div>
            <div>
              <header>{gameState}</header>
              <div>
                <div>{context.remainingTime / 1000} s</div>
                <div>
                  {context.result.currentOrder} / {context.data.orders.length}
                </div>
                <p>Orders</p>
                <ul>
                  {orderItems.map((item, i) => (
                    <li key={i}>
                      <OrderItem type={item.food} isSelected={item.selected} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {(gameState === 'win' || gameState === 'lose') && (
          <div>
            <p>{gameState}</p>
            <button
              onClick={() => {
                send('REPLAY');
                setItems([]);
              }}
            >
              Replay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
