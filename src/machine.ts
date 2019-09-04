import { assign, Machine } from 'xstate';
import { createEmptyArray, flatten } from './lib/array';
import { insertRandom, randomInt, randomItems } from './lib/random';
import { Food } from './type';

const FOOD_OPTIONS: Readonly<Food[]> = [
  'nasilemak',
  'asamlaksa',
  'bandung',
  'kopi',
  'limauais',
  'ayamrendang',
  'rotibakar',
  'roticanai',
  'soyacincau',
  'tehtarik',
];

interface GameContext {
  remainingTime: number;
  data: {
    orders: Food[][];
    items: Food[];
  };
  result: {
    currentOrder: number;
    selectedItem: Food[];
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
  | { type: 'TICK' }
  | { type: 'REPLAY' }
  | { type: 'SELECT_FOOD'; food: Food };

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    id: 'game',
    initial: 'landing',
    context: {
      remainingTime: 20000,
      data: {
        orders: [],
        items: [],
      },
      result: {
        currentOrder: 0,
        selectedItem: [],
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
        activities: 'spawnItem',
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
          TICK: {
            actions: 'oneSecondPass',
          },
          SELECT_FOOD: {
            actions: 'selectItem',
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
        data: () => {
          const orderCount = randomInt(3, 2);

          const orders = createEmptyArray(orderCount).map(() =>
            randomItems(FOOD_OPTIONS, randomInt(3, 2))
          );

          const allOrderItems = flatten(orders);

          return {
            orders,
            items: insertRandom(
              allOrderItems,
              randomItems(FOOD_OPTIONS, 18 - allOrderItems.length)
            ),
          };
        },
        result: {
          currentOrder: 0,
          selectedItem: [],
        },
      }),
      oneSecondPass: assign<GameContext>({
        remainingTime: context => context.remainingTime - 1000,
      }),
      selectItem: assign<GameContext>({
        result: ({ data, result }, event) => {
          const food: Food = event.food;

          const orderItems = data.orders[result.currentOrder].slice();
          result.selectedItem.forEach(item => {
            orderItems.splice(orderItems.indexOf(item), 1);
          });

          if (orderItems.indexOf(food) !== -1) {
            return {
              currentOrder:
                orderItems.length === 1
                  ? result.currentOrder + 1
                  : result.currentOrder,
              selectedItem:
                orderItems.length === 1 ? [] : result.selectedItem.concat(food),
            };
          }

          return result;
        },
      }),
    },
    guards: {
      isAllOrdersCompleted: ({ data, result }) =>
        data.orders.length === result.currentOrder,
      isTimeout: context => context.remainingTime <= 0,
    },
    services: {
      countdown: () => callback => {
        const interval = setInterval(() => callback('TICK'), 1000);

        return () => clearInterval(interval);
      },
    },
    activities: {
      spawnItem: context => {
        let index = 0;
        let timeoutId: number;

        function spawn() {
          console.log(`Spawning ${context.data.items[index]}`);
          index++;
          if (context.data.items.length > index) {
            timeoutId = setTimeout(spawn, 1000);
          }
        }

        timeoutId = setTimeout(spawn, 1000);

        return () => clearTimeout(timeoutId);
      },
    },
  }
);
