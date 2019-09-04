import { useMachine } from '@xstate/react';
import * as React from 'react';
import './app.scss';
import { Button } from './components/button';
import { Item } from './components/item';
import { OrderItem } from './components/order-item';
import { Paper } from './components/paper';
import { Separator } from './components/separator';
import { Sequence } from './components/sequence';
import { Timer } from './components/timer';
import { useTransientState } from './hooks';
import { gameMachine } from './machine';
import { Food } from './type';

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

  const [hasExtraPoint, setHasExtraPoint] = useTransientState(false);
  React.useEffect(() => {
    if (context.result.currentOrder !== 0) {
      setHasExtraPoint(true);
    }
  }, [context.result.currentOrder, setHasExtraPoint]);

  const [selectedItems, remainingItems] = React.useMemo(() => {
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

    return [selectedItems, allOrderItems];
  }, [
    context.data.orders,
    context.result.currentOrder,
    context.result.selectedItem,
  ]);

  return (
    <div className="App">
      <div className="game-panel">
        <div className="playground">
          <h1 className="game-title">Mamak Machine</h1>
          {gameState === 'landing' && (
            <Button onClick={() => send('START')}>Start</Button>
          )}
          {gameState === 'starting' && (
            <Sequence totalTime={2000}>
              <h1 className="text-large">Ready?</h1>
              <h1 className="text-large">Go!</h1>
            </Sequence>
          )}
          {gameState === 'playing' && (
            <>
              {items.map((item, i) => (
                <Item
                  onClick={() => send({ type: 'SELECT_FOOD', food: item })}
                  matched={remainingItems.includes(item)}
                  type={item}
                  key={i}
                />
              ))}
              {hasExtraPoint && <h1>Extra 2 Points for Complete Order!</h1>}
            </>
          )}
          {(gameState === 'win' || gameState === 'lose') && (
            <div>
              <div className="text-large">
                <p>{gameState === 'win' ? 'You Win!' : 'Game Over!'}</p>
                <p>Your score is {context.result.score}.</p>
              </div>
              <Button
                onClick={() => {
                  send('REPLAY');
                  setItems([]);
                }}
              >
                Replay
              </Button>
            </div>
          )}
        </div>
        <Paper className="game-dashboard">
          <div className="game-stats">
            <Timer remainingMs={context.remainingTime} />
            <Separator />
            <h2>Score: {context.result.score}</h2>
            <Separator />
            <h2>
              Order <span className="more-than-small">completed</span>:{' '}
              {context.result.currentOrder} / {context.data.orders.length}
            </h2>
          </div>
          <div className="order-items">
            {selectedItems.map((item, i) => (
              <div key={i}>
                <OrderItem type={item} isSelected={true} />
              </div>
            ))}
            {remainingItems.map((item, i) => (
              <div key={-i}>
                <OrderItem type={item} isSelected={false} />
              </div>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
};
