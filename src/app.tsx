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
          <button onClick={() => send('COMPLETE_ORDER')}>
            Complete Order!
          </button>
        )}
        {(current.value === 'win' || current.value === 'lose') && (
          <button onClick={() => send('REPLAY')}>Replay</button>
        )}
      </div>
    </div>
  );
}

export default App;
