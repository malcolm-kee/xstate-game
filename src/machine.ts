import { assign, Machine } from 'xstate';

interface GameContext {
  remainingTime: number;
  remainingOrders: number;
}

interface GameStateSchema {
  states: {
    landing: {};
    playing: {};
    win: {};
    lose: {};
  };
}

type GameEvent =
  | { type: 'START' }
  | { type: 'COMPLETE_ORDER' }
  | { type: 'TICK' }
  | { type: 'REPLAY' };

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    id: 'game',
    initial: 'landing',
    context: {
      remainingTime: 20000,
      remainingOrders: 2,
    },
    states: {
      landing: {
        on: {
          START: 'playing',
        },
      },
      playing: {
        entry: 'resetGame',
        // invoke spawn item activities
        invoke: {
          id: 'countdown',
          src: 'countdown',
        },
        on: {
          '': [
            {
              target: 'win',
              cond: 'isAllOrdersCompleted',
            },
            {
              target: 'lose',
              cond: 'isTimeout',
            },
          ],
          COMPLETE_ORDER: {
            actions: 'deductRemainingOrders',
          },
          TICK: {
            actions: 'oneSecondPass',
          },
        },
      },
      win: {
        on: {
          REPLAY: 'playing',
        },
      },
      lose: {
        on: {
          REPLAY: 'playing',
        },
      },
    },
  },
  {
    actions: {
      resetGame: assign({
        remainingTime: 20000,
        remainingOrders: (): number => (Math.random() > 0.5 ? 3 : 2),
      }),
      deductRemainingOrders: assign<GameContext>({
        remainingOrders: context => context.remainingOrders - 1,
      }),
      oneSecondPass: assign<GameContext>({
        remainingTime: context => context.remainingTime - 1000,
      }),
    },
    guards: {
      isAllOrdersCompleted: context => context.remainingOrders === 0,
      isTimeout: context => context.remainingTime <= 0,
    },
    services: {
      countdown: () => callback => {
        const interval = setInterval(() => callback('TICK'), 1000);

        return () => clearInterval(interval);
      },
    },
  }
);
