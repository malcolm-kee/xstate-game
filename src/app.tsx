import { useMachine } from '@xstate/react';
import * as React from 'react';
import './App.css';
import { gameMachine } from './machine';

function App() {
  const [current, send] = useMachine(gameMachine);

  return (
    <div className="App">
      <header>{current.value}</header>
      <pre>{JSON.stringify(current.context, null, 2)}</pre>
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
