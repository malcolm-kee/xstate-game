export function randomInt(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomItem<T>(array: T[]) {
  return array[randomInt(array.length - 1)];
}

export function randomItems<T>(options: T[], count: number) {
  return Array.from({ length: count }).map(() => randomItem(options));
}

export function insertRandom<T>(oriArray: T[], items: T[]) {
  const array = oriArray.slice();

  items.forEach(item => {
    const index = randomInt(array.length);
    array.splice(index, 0, item);
  });

  return array;
}
