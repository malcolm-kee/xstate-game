import { assign, Machine } from 'xstate';

export const gameMachine = Machine(
  {
    id: 'game',
    initial: 'landing',
    context: {
      gameDuration: 20000,
      requiredOrders: 2,
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
        remainingTime: context => context.gameDuration,
        remainingOrders: context => context.requiredOrders,
      }),
      deductRemainingOrders: assign({
        remainingOrders: context => context.remainingOrders - 1,
      }),
      oneSecondPass: assign({
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
