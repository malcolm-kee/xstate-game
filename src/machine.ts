import { assign, Machine } from 'xstate';
import { createEmptyArray, flatten } from './array';
import { randomInt, randomItems, insertRandom } from './random';

type Food = 'nasi-lemak' | 'satay' | 'teh-tarik';

const FOOD_OPTIONS: Readonly<Food[]> = ['nasi-lemak', 'satay', 'teh-tarik'];

interface GameContext {
  remainingTime: number;
  remainingOrders: number;
  data: {
    orders: Food[][];
    items: Food[];
  };
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
      data: {
        orders: [],
        items: [],
      },
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
      resetGame: assign<GameContext>({
        remainingTime: 20000,
        remainingOrders: (): number => (Math.random() > 0.5 ? 3 : 2),
        data: () => {
          const orderCount = randomInt(3, 2);

          const orders = createEmptyArray(orderCount).map(() =>
            randomItems(FOOD_OPTIONS, randomInt(3, 2))
          );

          return {
            orders,
            items: insertRandom(flatten(orders), randomItems(FOOD_OPTIONS, 20)),
          };
        },
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
