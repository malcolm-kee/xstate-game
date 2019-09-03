import { useMachine } from '@xstate/react';
import * as React from 'react';
import './App.css';
import { Food } from './type';
import { gameMachine } from './machine';

function App() {
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
  const [current, send] = useMachine(machine);

  return (
    <div className="App">
      <header>{current.value}</header>
      <div>
        Coming Items:
        <pre>{JSON.stringify(current.context.data.orders, null, 2)}</pre>
      </div>
      <div>{current.context.remainingTime / 1000} s</div>
      <div>{current.context.result.currentOrder}</div>
      <div>
        {current.value === 'landing' && (
          <button onClick={() => send('START')}>Start</button>
        )}
        {current.value === 'playing' && (
          <div>
            <button
              onClick={() => send({ type: 'SELECT_FOOD', food: 'nasi-lemak' })}
            >
              Nasi Lemak
            </button>
            <button
              onClick={() => send({ type: 'SELECT_FOOD', food: 'satay' })}
            >
              Satay
            </button>
            <button
              onClick={() => send({ type: 'SELECT_FOOD', food: 'teh-tarik' })}
            >
              Teh Tarik
            </button>
            <button onClick={() => send('COMPLETE_ORDER')}>
              Complete Order!
            </button>
            <div>
              {items.map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        )}
        {(current.value === 'win' || current.value === 'lose') && (
          <button onClick={() => send('REPLAY')}>Replay</button>
        )}
      </div>
    </div>
  );
}

export default App;
